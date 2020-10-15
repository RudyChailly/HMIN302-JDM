import { Component, OnInit } from '@angular/core';
import { RelationsService } from '../relations/relations.service';
import { RezoDumpService } from '../rezo-dump/rezo-dump.service';
import { BreadcrumbService } from './breadcrumb.service';

@Component({
	selector: 'app-breadcrumb',
	templateUrl: './breadcrumb.component.html',
	styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {

	historique;

	constructor(
		private relationsService: RelationsService,
		private rezoDumpService: RezoDumpService,
		private breadcrumbService: BreadcrumbService
	) { }

	ngOnInit(): void {
		this.breadcrumbService.historiqueSubject.subscribe(historique => {
			this.historique = historique;
		});
	}

	select(terme: string, indice: number) {
		if (indice >= 0) {
			this.breadcrumbService.slice(indice);
			this.relationsService.requestRelations(terme);
		}
	}

}
