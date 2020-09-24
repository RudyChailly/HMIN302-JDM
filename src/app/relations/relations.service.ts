import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class RelationsService {

	terme : string = "";
	termeSubject = new Subject<string>();
	typeRelation : number = 5;
	relations;
	relationsSubject = new Subject<any>();
	historiqueTermes = new Array<string>();
	historiqueTermesSubject = new Subject<Array<string>>();
	
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
	setTypeRelation(typeRelation: number) {
		this.typeRelation = typeRelation;
	}

	getTypeRelation(): number {
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
		this.terme = this.historiqueTermes[this.historiqueTermes.length-1];
		this.historiqueTermesSubject.next(this.historiqueTermes);
	}

	addToHistoriqueTermes(terme : string) {
		this.terme = terme;
		this.historiqueTermes.push(terme);
		this.historiqueTermesSubject.next(this.historiqueTermes);
	}

	getHistoriqueTermes() {
		return this.historiqueTermes;
	}

	sliceHistoriqueTermes(indice: number) {
		if (indice >= 0) {
			this.historiqueTermes = this.historiqueTermes.slice(0, indice);
			this.terme = this.historiqueTermes[this.historiqueTermes.length-1];
			this.historiqueTermesSubject.next(this.historiqueTermes);
		}
	}

}
