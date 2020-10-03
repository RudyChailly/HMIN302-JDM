import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { typeRelations, getRelationById } from '../relations/relations.variables';

@Injectable({
	providedIn: 'root'
})
export class RelationsService {

	terme : string = "";
	termeSubject = new Subject<string>();
	typeRelation = getRelationById(5);
	relations;
	relationsSubject = new Subject<any>();
	historiqueTermes = new Array<any>();
	historiqueTermesSubject = new Subject<Array<any>>();
	
	constructor() { }

	/******************** TERME ********************/
	setTerme(terme: string) {
		this.terme = terme;
		this.termeSubject.next(terme);
	}

	getTerme(): string {
		return this.terme;
	}

	/******************** TYPE RELATION ********************/
	setTypeRelation(typeRelation) {
		this.typeRelation = typeRelation;
	}

	getTypeRelation() {
		return this.typeRelation;
	}

	/******************** RELATIONS ********************/
	setRelations(relations) {
		this.relations = relations;
		this.relationsSubject.next(relations);
	}

	getRelations() {
		return this.relations;
	}

	/******************** HISTORIQUE ********************/
	setHistoriqueTermes(historiqueTermes) {
		this.historiqueTermes = historiqueTermes;
		this.terme = this.historiqueTermes[this.historiqueTermes.length-1].terme;
		this.historiqueTermesSubject.next(this.historiqueTermes);
	}

	addToHistoriqueTermes(terme : string) {
		this.terme = terme;
		if (this.historiqueTermes.length > 0) {
			this.historiqueTermes[this.historiqueTermes.length-1].relation = this.typeRelation.short;
		}
		this.historiqueTermes.push({"terme": terme, "relation": null});
		this.historiqueTermesSubject.next(this.historiqueTermes);
	}

	getHistoriqueTermes() {
		return this.historiqueTermes;
	}

	sliceHistoriqueTermes(indice: number) {
		if (indice >= 0) {
			this.historiqueTermes = this.historiqueTermes.slice(0, indice);
			this.terme = this.historiqueTermes[this.historiqueTermes.length-1].terme;
			this.historiqueTermesSubject.next(this.historiqueTermes);
		}
	}

}
