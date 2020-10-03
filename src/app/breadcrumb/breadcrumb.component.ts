import { Component, OnInit } from '@angular/core';
import { RelationsService } from '../relations/relations.service';
import { RezoDumpService } from '../rezo-dump/rezo-dump.service';

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

	historiqueTermes;

	constructor(
		private relationsService : RelationsService,
		private rezoDumpService : RezoDumpService
	) { }

	ngOnInit(): void {
		this.relationsService.historiqueTermesSubject.subscribe(historique => {
			console.log(historique);
			this.historiqueTermes = historique;
		});
	}

	requestRelations(terme: string, indice: number): void {
		//this.relationsService.addToHistoriqueTermes(terme);
		this.rezoDumpService.requestRelations(terme, this.relationsService.getTypeRelation().id).then(() => {
			this.relationsService.sliceHistoriqueTermes(indice);
		});
	}

}
