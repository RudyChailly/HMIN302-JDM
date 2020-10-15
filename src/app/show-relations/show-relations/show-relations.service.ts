import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowRelationsService {

	relationsSubject = new Subject<Array<string>>();
	raffinementsSubject = new Subject<Array<string>>();

  	constructor() { }

  	setRelations(relations) {
  		this.relationsSubject.next(relations);
  	}

  	setRaffinements(raffinements) {
  		this.raffinementsSubject.next(raffinements);
  	}
}
