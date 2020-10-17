import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { RelationsService } from '../relations/relations.service';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

	historique = new Array<any>();
	historiqueSubject = new Subject<any>();

  	constructor(
  		private relationsService: RelationsService
  	) { }

  	setHistorique(historique) {
		this.historique = historique;
		this.historiqueSubject.next(this.historique);
	}

  	add(terme : string) {
		if (this.historique.length > 0) {
			this.historique[this.historique.length-1].r = this.relationsService.getTypeRelation().short;
		}
		this.historique.push({"t": terme, "r": null});
		if (this.historique.length > 7) {
			this.setHistorique(this.historique.slice(1));
		}
		this.historiqueSubject.next(this.historique);
	}

	slice(indice: number) {
		this.setHistorique(this.historique.slice(0, indice));
	}

	reset() {
		this.setHistorique([]);
	}

}
