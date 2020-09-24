import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { serverURL } from '../app.config';

import { RelationsService } from '../relations/relations.service';

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
		let relations = {
			"terme": terme, 
			"synonymes": [], 
			"generiques": [], 
			"specifiques": [], 
			"antonymes": [], 
			"lemmes": [] 
		};
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
						if (elems[4] == "5") {
							if (elems[2] == idTerme) {
								if (mots[elems[3]] != null && elems[5] > 20) {
									relations.synonymes.push({"terme" : mots[elems[3]], "poids": elems[5]});
								}
							}
						}
						else if (elems[4] == "6") {
							if (elems[2] == idTerme) {
								if (mots[elems[3]] != null && elems[5] > 20) {
									relations.generiques.push({"terme" : mots[elems[3]], "poids": elems[5]});
								}
							}
						}
						else if (elems[4] == "7") {
							if (elems[2] == idTerme) {
								if (mots[elems[3]] != null && elems[5] > 20) {
									relations.antonymes.push({"terme" : mots[elems[3]], "poids": elems[5]});
								}
							}
						}
						else if (elems[4] == "8") {
							if (elems[2] == idTerme) {
								if (mots[elems[3]] != null && elems[5] > 20) {
									relations.specifiques.push({"terme" : mots[elems[3]], "poids": elems[5]});
								}
							}
						}
						else if (elems[4] == "19") {
							if (elems[2] == idTerme) {
								if (mots[elems[3]] != null && elems[5] > 20 && mots[elems[3]] != terme) {
									relations.lemmes.push({"terme" : mots[elems[3]], "poids": elems[5]});
								}
							}
						}
					}
				}
				let poids_max;
				if (relations.synonymes.length > 0) {
					relations.synonymes = relations.synonymes.sort(function(a,b) { return b.poids - a.poids});
					poids_max = relations.synonymes[0].poids;
					/*relations.synonymes.forEach(synonyme => {
						synonyme.poids = synonyme.poids / poids_max;
					});*/
				}
				if (relations.antonymes.length > 0) {
					relations.antonymes = relations.antonymes.sort(function(a,b) { return b.poids - a.poids}).slice(0,10);
					poids_max = relations.antonymes[0].poids;
					/*relations.antonymes.forEach(antonyme => {
						antonyme.poids = antonyme.poids / poids_max;
					});*/
				}
				if (relations.generiques.length > 0) {
					relations.generiques = relations.generiques.sort(function(a,b) { return b.poids - a.poids}).slice(0,10);
					poids_max = relations.generiques[0].poids;
					/*relations.generiques.forEach(generique => {
						generique.poids = generique.poids / poids_max;
					});*/
				}			

				if (relations.specifiques.length > 0) {
					relations.specifiques = relations.specifiques.sort(function(a,b) { return b.poids - a.poids});
					poids_max = relations.specifiques[0].poids;
					/*relations.specifiques.forEach(specifique => {
						specifique.poids = specifique.poids / poids_max;
					});*/
				}
				this.relationsService.setRelations(relations);
				this.relationsService.setTypeRelation(typeRelation);
				this.relationsService.setTerme(terme);
				resolve(relations);
			}
		}));
	}

	requestRelationsType(typeRelation: number) {
		this.requestRelations(this.relationsService.getTerme(), typeRelation)
	}
}
