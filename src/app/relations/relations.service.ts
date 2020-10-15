import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

import { StorageService } from "./storage/storage.service";
import { RezoDumpService } from "../rezo-dump/rezo-dump.service";
import { ShowRelationsService } from "../show-relations/show-relations/show-relations.service"
import { typeRelations, getRelationById } from '../relations/relations.variables';
import { serverURL } from '../app.config';

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
export class RelationsService {

	constructor(
		private http: HttpClient,
		private storageService: StorageService,
		private rezoDumpService: RezoDumpService,
		private showRelationsService: ShowRelationsService
		) { }

	/******************** TERME ********************/
	terme : string = "";
	termeSubject = new Subject<string>();

	setTerme(terme: string) {
		this.terme = terme;
		this.termeSubject.next(terme);
	}

	getTerme(): string {
		return this.terme;
	}

	/******************** TYPE RELATION ********************/
	typeRelation = getRelationById(5);

	setTypeRelation(typeRelation: number) {
		this.typeRelation = getRelationById(typeRelation);
	}

	getTypeRelation() {
		return this.typeRelation;
	}

	/******************** RELATIONS ********************/
	relations = {};

	setRelations(relations) {
		this.relations = relations;
	}

	getRelations() {
		return this.relations;
	}

	requestRelations(terme: string, refreshRaffinement = true): Promise<any> {
		let typeRelation = this.typeRelation.id;
		console.log(terme + " | " + typeRelation)
		if (this.getTerme() == terme) {
			if (this.getRelations()[typeRelation] != null) {
				let relations = this.getRelations();
				if (refreshRaffinement) {
					this.showRelationsService.setRaffinements(relations["1"]);
				}
				this.setTerme(terme);
				this.setRelations(relations);
				this.showRelationsService.setRelations(relations[typeRelation]);
				return new Promise(resolve => resolve(relations));
			}
			else {
				return new Promise(resolve => {
					this.requestRelationsType(terme, typeRelation).then(relations => {
						if (refreshRaffinement) {
							this.showRelationsService.setRaffinements(relations["1"]);
						}
						this.setTerme(terme);
						this.setRelations(relations);
						this.showRelationsService.setRelations(relations[typeRelation]);
						resolve(relations);
					});
				});
			}
		}
		else {
			return new Promise(resolve => {
				this.requestRelationsType(terme, 1).then(relations1 => {
					if (refreshRaffinement) {
						this.showRelationsService.setRaffinements(relations1["1"]);
					}
					this.requestRelationsType(terme, typeRelation, relations1).then(relations => {
						this.setTerme(terme);
						this.setRelations(relations);
						this.showRelationsService.setRelations(relations[typeRelation]);
						resolve(relations);
					});
				});
			});
		}
	}

	private requestRelationsType(terme: string, typeRelation: number, relations = null): Promise<any> {
		let storageRelations = this.storageService.load(terme);
		if (storageRelations != null) {
			if (storageRelations[typeRelation] != null) {
				return new Promise(resolve => resolve(storageRelations));
			}
			else {
				if (this.getTerme() == terme) {
					return this.rezoDumpService.requestRelations(terme, typeRelation, storageRelations);
				}
				else {
					return this.rezoDumpService.requestRelations(terme, typeRelation);
				}
			}
		}
		else {
			if (this.getTerme() == terme) {
				return this.rezoDumpService.requestRelations(terme, typeRelation, relations);
			}
			else {
				return this.rezoDumpService.requestRelations(terme, typeRelation);
			}
		}
	}

}
