import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowRelationsService {

	relationsSubject = new Subject<Array<string>>();
  pagination: number = 60;
  paginationSubject = new Subject<boolean>();
	raffinementsSubject = new Subject<Array<string>>();
  triSubject = new Subject<number>();

  constructor() { 
    this.paginationSubject.next(false);
  }

  setRelations(relations, reset = false) {
    if (relations.length > this.getPagination()) {
      this.setHasMore(true);
    }
    else {
      this.setHasMore(false);
    }

    if (reset) {
      this.resetPagination();
      
    }
    this.relationsSubject.next(relations.slice(0, this.getPagination()));
    // this.relationsSubject.next(relations);
  }

  setRaffinements(raffinements) {
    this.raffinementsSubject.next(raffinements);
  }

  setTri(tri: number) {
    this.triSubject.next(tri);
  }

  resetPagination() {
    this.pagination = 60;
  }

  incrPagination() {
    this.pagination += 60;
  }

  getPagination(): number {
    return this.pagination;
  }

  setHasMore(value: boolean) {
    this.paginationSubject.next(value);
  }
}
