import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { serverURL } from '../../app.config';
import { Observable, Subscription } from 'rxjs';

export let cacheName: string = "djmc-cache";

const httpOptions = {
  headers: new HttpHeaders ({
    "Access-Control-Allow-Methods": "GET,POST",
    "Access-Control-Allow-Headers": "Content-type",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  })
}
@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private http: HttpClient
  ) {
  	let storage = JSON.parse(localStorage.getItem(cacheName));
  	this.cleanLocal();
  }

  load(terme: string) {
  	let storage = JSON.parse(localStorage.getItem(cacheName));
  	if (storage == undefined) {
  		return null;
  	}
  	let terme_relations = storage.filter(function(element) {
	  	return element.t == terme;
	});
	if (terme_relations.length > 0) {
	  	return terme_relations[0];
	}
	return null;
  }

  saveLocal(terme: string, typeRelation: number, relations: Array<string>) {
  	let storage = JSON.parse(localStorage.getItem(cacheName));
  	if (storage == undefined) {
  		storage = [];
  		let terme_relations = {"t" : terme, "d" : Date.now() }
	  	terme_relations[typeRelation] = relations;
	  	storage.push(terme_relations);
  	}
  	else {
  		let terme_relations = storage.filter(function(element) {
	  		return element.t == terme;
		});
		if (terme_relations.length > 0) {
		  	terme_relations[0][typeRelation] = relations;
		}
		else {
		  	terme_relations = {"t" : terme, "d" : Date.now() }
		  	terme_relations[typeRelation] = relations;
		  	storage.push(terme_relations);
		}
  	}
  	localStorage.setItem(cacheName, JSON.stringify(storage));	
  }

  saveServer(terme: string, typeRelation: number, relations: Array<string>): Observable<any> {
    return this.http.post(serverURL+'/save', {'terme': terme, 'typeRelation': typeRelation, 'relations': relations});
  }

  cleanLocal() {
  	localStorage.removeItem(cacheName);
  }

}
