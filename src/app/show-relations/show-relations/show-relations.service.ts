import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowRelationsService {

	relationsSubject = new Subject<Array<string>>();
	raffinementsSubject = new Subject<Array<string>>();
  triSubject = new Subject<number>();

  constructor() { }

  setRelations(relations) {
    this.relationsSubject.next(relations);
  }

  setRaffinements(raffinements) {
    this.raffinementsSubject.next(raffinements);
  }

  setTri(tri: number) {
    this.triSubject.next(tri);
  }
}
