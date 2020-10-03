import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { RelationsService } from '../relations/relations.service';
import { RezoDumpService } from '../rezo-dump/rezo-dump.service';
import { typeRelations, getRelationById } from '../relations/relations.variables';
import $ from "jquery";

@Component({
	selector: 'app-show-relations',
	templateUrl: './show-relations.component.html',
	styleUrls: ['./show-relations.component.css']
})
export class ShowRelationsComponent implements OnInit {

	terme : string = "";
	typeRelationsAffichees: string;
	relationsAffichees = null;

	constructor(
		private relationsService: RelationsService,
		private rezoDumpService: RezoDumpService
		) { }

	ngOnInit(): void {
		this.relationsService.termeSubject.subscribe(terme => {
			this.terme = terme;
		});
		this.relationsService.relationsSubject.subscribe(relations => {
			let typeRelationName = getRelationById(this.relationsService.getTypeRelation().id).nom.toLowerCase();
			this.relationsAffichees = relations[typeRelationName];
		});
	}

	afficherTypeRelations(typeRelation: string): void {
		this.relationsAffichees = this.relationsService.getRelations()[typeRelation];
		$("#show-relations-bouton-"+this.typeRelationsAffichees).removeClass("font-weight-bold");
		$("#show-relations-bouton-"+typeRelation).addClass("font-weight-bold");
		this.typeRelationsAffichees = typeRelation;
	}

	requestRelations(terme: string): void {
		this.rezoDumpService.requestRelations(terme, this.relationsService.getTypeRelation().id).then(relations => {
			this.relationsService.addToHistoriqueTermes(terme);
		});
	}

}
