import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

	saisieSubject = new Subject<string>();

	constructor() { }

	setSaisie(saisie: string) {
		this.saisieSubject.next(saisie);
	}
}
