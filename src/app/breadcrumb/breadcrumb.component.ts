import { Component, OnInit } from '@angular/core';
import { RelationsService } from '../relations/relations.service';
import { RezoDumpService } from '../rezo-dump/rezo-dump.service';

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

	historiqueTermes : Array<string>

	constructor(
		private relationsService : RelationsService,
		private rezoDumpService : RezoDumpService
	) { }

	ngOnInit(): void {
		this.relationsService.historiqueTermesSubject.subscribe(historique => {
			this.historiqueTermes = historique;
		});
	}

	requestRelations(terme: string, indice: number): void {
		//this.relationsService.addToHistoriqueTermes(terme);
		this.rezoDumpService.requestRelations(terme, this.relationsService.getTypeRelation()).then(() => {
			this.relationsService.sliceHistoriqueTermes(indice);
		});
	}

}
