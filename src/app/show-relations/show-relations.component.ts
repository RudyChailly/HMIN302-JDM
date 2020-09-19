import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { RelationsService } from '../relations/relations.service';
import $ from "jquery";

@Component({
	selector: 'app-show-relations',
	templateUrl: './show-relations.component.html',
	styleUrls: ['./show-relations.component.css']
})
export class ShowRelationsComponent implements OnInit {

	typeRelationsAffichees: string;
	relationsAffichees;

	constructor(
		private relationsService: RelationsService
	) { }

	ngOnInit(): void {
		this.relationsService.relationsSubject.subscribe(relations => {
			if (relations.synonymes != null) {
				this.typeRelationsAffichees = "synonymes";
				this.relationsAffichees = relations.synonymes;
				$("#show-relations-bouton-"+this.typeRelationsAffichees).addClass("font-weight-bold");
			}
			console.log(relations);
		});
	}

	afficherTypeRelations(typeRelation: string): void {
		this.relationsAffichees = this.relationsService.getRelations()[typeRelation];
		$("#show-relations-bouton-"+this.typeRelationsAffichees).removeClass("font-weight-bold");
		$("#show-relations-bouton-"+typeRelation).addClass("font-weight-bold");
		this.typeRelationsAffichees = typeRelation;
	}

}
