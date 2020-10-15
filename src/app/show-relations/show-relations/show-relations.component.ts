import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { RelationsService } from '../../relations/relations.service';
import { RezoDumpService } from '../../rezo-dump/rezo-dump.service';
import { typeRelations, getRelationById } from '../../relations/relations.variables';
import { StorageService } from '../../relations/storage/storage.service';
import { ShowRelationsService } from './show-relations.service';
import { BreadcrumbService } from '../../breadcrumb/breadcrumb.service';

import $ from "jquery";

@Component({
	selector: 'app-show-relations',
	templateUrl: './show-relations.component.html',
	styleUrls: ['./show-relations.component.css']
})
export class ShowRelationsComponent implements OnInit {

	terme : string = "";

	typeRelations: string;
	relations = null;

	constructor(
		private relationsService: RelationsService,
		private rezoDumpService: RezoDumpService,
		private storageService: StorageService,
		private showRelationService: ShowRelationsService,
		private breadcrumbService: BreadcrumbService
		) { }

	ngOnInit(): void {
		this.relationsService.termeSubject.subscribe(terme => {
			this.terme = terme;
		});
		this.showRelationService.relationsSubject.subscribe(relations => {
			this.relations = relations;
		});
	}

	requestRelations(terme: string): void {
		this.breadcrumbService.add(terme);
		this.relationsService.requestRelations(terme);
	}

}
