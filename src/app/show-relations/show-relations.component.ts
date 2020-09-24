import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { RelationsService } from '../relations/relations.service';
import { RezoDumpService } from '../rezo-dump/rezo-dump.service';
import $ from "jquery";

@Component({
	selector: 'app-show-relations',
	templateUrl: './show-relations.component.html',
	styleUrls: ['./show-relations.component.css']
})
export class ShowRelationsComponent implements OnInit {

	typeRelationsAffichees: string;
	relationsAffichees = null;

	constructor(
		private relationsService: RelationsService,
		private rezoDumpService: RezoDumpService
	) { }

	ngOnInit(): void {
		this.relationsService.relationsSubject.subscribe(relations => {
			if (relations.synonymes != null && relations.synonymes.length > 0) {
				if (this.typeRelationsAffichees != null) {
					$("#show-relations-bouton-"+this.typeRelationsAffichees).removeClass("font-weight-bold");
				}
				this.typeRelationsAffichees = "synonymes";
				this.relationsAffichees = relations.synonymes;
				$("#show-relations-terme").html(relations.terme);
			}
			else {
				this.typeRelationsAffichees = "generiques";
				this.relationsAffichees = relations.generiques;
				$("#show-relations-terme").html(relations.terme);
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

	requestRelations(terme: string): void {
		this.rezoDumpService.requestRelations(terme, this.relationsService.getTypeRelation()).then(relations => {
			this.relationsService.addToHistoriqueTermes(terme);
		});
	}

}
