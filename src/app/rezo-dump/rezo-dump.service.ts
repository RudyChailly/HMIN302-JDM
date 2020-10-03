import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { serverURL } from '../app.config';

import { RelationsService } from '../relations/relations.service';
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
		private relationsService: RelationsService
	) { }

	requestRelations(terme: string, typeRelation: number) {
		let idTerme;
		let mots = {};
		let relations;
		let relationById = getRelationById(typeRelation);
		let typeRelationName = relationById.nom.toLowerCase();
		// Si le terme en paramètre est le même que terme entré : changement de type de relation
		if (terme == this.relationsService.getTerme()) {
			relations = this.relationsService.getRelations();
			// Si les relations ont déjà été récupérées
			if (relations[typeRelationName] != null) {
				return new Promise(resolve => {
					this.relationsService.setTypeRelation(typeRelation);
					//this.relationsService.setTerme(terme);
					this.relationsService.setRelations(relations);
					resolve(relations);
				});
			}
		}
		// Sinon : changement de terme et récupération des relations
		else {
			relations = {
				"terme": terme
			}
		}
		
		relations[typeRelationName] = [];
		return new Promise(resolve => this.http.get(serverURL +'/rezo-dump/'+encodeURIComponent(terme)+"/"+typeRelation).subscribe(CODE => {
			if (CODE['text'] == undefined || CODE['text'] == null) {
				resolve(terme);
			}
			else {
				for (let line of CODE['text'].split('\n')) {
					if (line.startsWith("e;")) {
						let elems = line.split(";");
						if (elems[3] == "1" || elems[3] == "2") {
							let mot;
							if (elems[2][0] == "'" && elems[2][elems[2].length-1] == "'") {
								if (!(elems[2].includes(">")) && !(elems[2].includes("="))) {
									mot = elems[2].slice(1, elems[2].length-1);
								}
							}
							else {
								mot = elems[2];
							}
							mots[elems[1]] = mot;
							if (mot == terme) {
								idTerme = elems[1];
							}
						}
					}
					else if (line.startsWith("r;")) {
						let elems = line.split(";");
						if (elems[4] == typeRelation) {
							if (elems[2] == idTerme) {
								if (mots[elems[3]] != null && elems[5] > 20) {
									relations[typeRelationName].push({"terme" : mots[elems[3]], "poids": elems[5]});
								}
							}
						}
					}
				}
				let poids_max;
				if (relations[typeRelationName].length > 0) {
					relations[typeRelationName] = relations[typeRelationName].sort(function(a,b) { return b.poids - a.poids});
					poids_max = relations[typeRelationName][0].poids;
					/*relations.synonymes.forEach(synonyme => {
						synonyme.poids = synonyme.poids / poids_max;
					});*/
				}
				this.relationsService.setTypeRelation(relationById);
				this.relationsService.setTerme(terme);
				this.relationsService.setRelations(relations);
				console.log(relations);
				resolve(relations);
			}
		}));
	}

	requestRelationsType(typeRelation: number) {
		this.requestRelations(this.relationsService.getTerme(), typeRelation)
	}
}
