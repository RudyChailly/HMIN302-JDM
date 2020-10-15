import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { serverURL } from '../app.config';

import { RelationsService } from '../relations/relations.service';
import { StorageService } from '../relations/storage/storage.service';
import { typeRelations, getRelationById } from '../relations/relations.variables';

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
export class RezoDumpService {

	constructor(
		private http: HttpClient,
		//private relationsService: RelationsService,
		private storageService: StorageService
		) { }

	/************************ RELATIONS ************************/
	requestRelations(terme: string, typeRelation: number, relations = {}) {
		if (relations[typeRelation] != null) {
			return new Promise(resolve => {
				resolve(relations);
			});
		}
		relations[typeRelation] = [];
		return new Promise(resolve => this.http.get(serverURL +'/rezo-dump/'+encodeURIComponent(terme)+"/"+typeRelation).subscribe(CODE => {
			if (CODE['cache'] != null) {
				relations = this.mergeRelations(relations, JSON.parse(CODE['cache']));
			}
			if (CODE['text'] != null) {
				this.scraper(CODE['text'], terme, typeRelation, relations);
				this.sort(typeRelation, relations);
			}
			if (typeRelation == 1) {
				relations["1"].forEach(relation => {
					/* s = splited */
					relation['s'] = relation['t'].split(terme+">")[1];
				});
			}
			if (relations[typeRelation] != null) {
				this.storageService.saveLocal(terme, typeRelation, relations[typeRelation]);
				this.storageService.saveServer(terme, typeRelation, relations[typeRelation]);
			}
			resolve(relations);
		}));
	}

	private mergeRelations(relations1, relations2) {
		Object.keys(relations1).forEach(key => {
			//TODO date
			if (parseInt(key) >= 0) {
				if (relations2[key] == undefined) {
					relations2[key] = relations1[key];
				}
			}
		});
		return relations2;
	}

	/************************ SCRAPER ************************/
	private scraper(text: string, terme, typeRelation, relations) {
		let idTerme;
		let mots = {};
		for (let line of text.split('\n')) {
			if (line.startsWith("e;")) {
				let mot = this.scraperMot(line, idTerme, terme, mots);
				if (mot != null) {
					mots[mot.id] = mot.mot;
					if (mot.mot == terme) {
						idTerme = mot.id;
					}
				}
			}
			else if (line.startsWith("r;")) {
				let relation = this.scraperRelation(line, idTerme, terme, mots, typeRelation, relations)
				if (relation != undefined) {
					if (relations[typeRelation] == undefined || relations[typeRelation] == null) {
						relations[typeRelation] = [];
					}
					relations[typeRelation].push(relation);
				}
			}
		}
	}
	private scraperMot(line: string, idTerme, terme: string, mots) {
		if (!(line.includes(':')) && !(line.includes('=')) && !(line.includes('[')) && !(line.includes(']'))) {
			let elems = line.split(";");
			if (elems[3] == "1" || elems[3] == "2") {
				let mot;
				if (elems[2][0] == "'" && elems[2][elems[2].length-1] == "'") {
					if (elems[2].includes(">")) {
						mot = elems[elems.length-1].slice(1, elems[elems.length-1].length-1);
					}
					else {
						mot = elems[2].slice(1, elems[2].length-1);
					}
				}
				else {
					if (elems[2].includes(">")) {
						mot = elems[elems.length-1];
					}
					else {
						mot = elems[2];
					}
				}
				if (mot != undefined) {
					return {"id": elems[1], "mot": mot}
				}
			}
		}
		return null;
	}

	private scraperRelation(line: string, idTerme, terme: string, mots, typeRelation, relations) {
		let elems = line.split(";");
		if (elems[4] == typeRelation) {
			if (elems[2] == idTerme) {
				if (mots[elems[3]] != undefined && parseInt(elems[5]) > 20) {
					if (typeRelation == 1 || (typeRelation != 1 && !(mots[elems[3]].includes(">")))) {
						return {"t" : mots[elems[3]], "p": elems[5]};
					}
				}
			}
		}
	}

	/************************ SORT ************************/
	private sort(typeRelation, relations) {
		let poids_max;
		if (relations[typeRelation] != undefined && relations[typeRelation].length > 0) {
			relations[typeRelation] = relations[typeRelation].sort(function(a,b) { return b.p - a.p});
			poids_max = relations[typeRelation][0].p;
			/*relations.synonymes.forEach(synonyme => {
				synonyme.poids = synonyme.poids / poids_max;
			});*/
		}
	}
}
