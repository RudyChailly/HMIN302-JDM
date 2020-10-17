import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { RelationsService } from '../../relations/relations.service';
import { RezoDumpService } from '../../rezo-dump/rezo-dump.service';
import { typeRelations, getRelationById } from '../../relations/relations.variables';
import { StorageService } from '../../relations/storage/storage.service';
import { ShowRelationsService } from './show-relations.service';
import { BreadcrumbService } from '../../breadcrumb/breadcrumb.service';

import $ from "jquery";
import * as SORT from '../show-relations-filters/sort.variables';

@Component({
	selector: 'app-show-relations',
	templateUrl: './show-relations.component.html',
	styleUrls: ['./show-relations.component.css']
})
export class ShowRelationsComponent implements OnInit {

	terme : string = "";
	relations = null;
	sortValue = SORT.SORT_POIDS;
	typeRelations;

	constructor(
		private relationsService: RelationsService,
		private rezoDumpService: RezoDumpService,
		private storageService: StorageService,
		private showRelationService: ShowRelationsService,
		private breadcrumbService: BreadcrumbService
		) { }

	ngOnInit(): void {
		this.relationsService.termeSubject.subscribe(terme => {
			this.terme = this.formatTerme(terme);
		});
		this.showRelationService.relationsSubject.subscribe(relations => {
			if (this.sortValue != SORT.SORT_POIDS) {
				relations = this.sortList(relations);
			}
			this.relations = relations;
			this.typeRelations = this.relationsService.getTypeRelation();
		});
		this.showRelationService.triSubject.subscribe(sort => {
			if (this.sortValue != sort) {
				this.sortValue = sort;
				this.sort();
			}
		});
	}

	requestRelations(terme: string): void {
		this.breadcrumbService.add(terme);
		this.relationsService.requestRelations(terme);
	}

	sort() {
		this.relations = this.sortList(this.relations);
	}

	sortList(liste) {
		if (this.sortValue == SORT.SORT_ALPHA) {
			liste = liste.sort((a,b) => a["t"].localeCompare(b["t"]));
		}
		else {
			liste = liste.sort((a,b) => b.p - a.p);
		}
		return liste;
	}

	formatTerme(terme: string) {
		if (terme.includes(">")) {
			let termeSplitted = terme.split(">");
			return termeSplitted[0] + " ("+termeSplitted[1]+")";
		}
		return terme;
	}

}
