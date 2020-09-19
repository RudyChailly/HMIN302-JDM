import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class RelationsService {

	relations;
	relationsSubject = new Subject<any>();
	
	constructor() { }

	setRelations(relations) {
		this.relations = relations;
		this.relationsSubject.next(relations);
	}

	getRelations() {
		return this.relations;
	}
}
