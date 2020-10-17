import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RezoDumpService } from '../../rezo-dump/rezo-dump.service';
import { RelationsService } from '../../relations/relations.service';
import { ShowRelationsService } from '../show-relations/show-relations.service'
import { typeRelations, getRelationById } from '../../relations/relations.variables';
import * as SORT from './sort.variables';
import $ from "jquery";

@Component({
	selector: 'app-show-relations-filters',
	templateUrl: './show-relations-filters.component.html',
	styleUrls: ['./show-relations-filters.component.css']
})
export class ShowRelationsFiltersComponent implements OnInit {

	showRelationsFiltersForm : FormGroup
	typeRelations;
	raffinements: Array<string> = [];

	constructor(
		private formBuilder: FormBuilder,
		private rezoDumpService : RezoDumpService,
		private relationsService : RelationsService,
		private showRelationsService: ShowRelationsService
	) { }

	ngOnInit(): void {
		this.typeRelations = typeRelations;
		this.showRelationsFiltersForm = this.formBuilder.group({
			relation: 5
		});
		this.initBoutonsTri();
		this.onChanges();
		this.showRelationsService.raffinementsSubject.subscribe(raffinements => {
			this.raffinements = raffinements;
		});
	}

	onChanges() {
		this.showRelationsFiltersForm.get("relation").valueChanges.subscribe(id => {
			this.relationsService.setTypeRelation(id);
			let terme = this.relationsService.getTerme();
			this.relationsService.requestRelations(terme,false);
		});
	}

	initBoutonsTri() {
		/* Boutons de tri */
		let showRelationsFiltersTriAlpha = $("#show-relations-filters-tri-alpha");
		let showRelationsFiltersTriPoids = $("#show-relations-filters-tri-poids");
		showRelationsFiltersTriAlpha.click(function() {
			showRelationsFiltersTriPoids.removeClass("btn-dark");
			showRelationsFiltersTriPoids.addClass("btn-outline-dark");
			$(this).addClass("btn-dark");
			$(this).removeClass("btn-outline-dark");
			
		});
		showRelationsFiltersTriPoids.click(function() {
			showRelationsFiltersTriAlpha.removeClass("btn-dark");
			showRelationsFiltersTriAlpha.addClass("btn-outline-dark");
			$(this).addClass("btn-dark");
			$(this).removeClass("btn-outline-dark");
		});
	}

	tri(tri: number) {
		this.showRelationsService.setTri(tri);
	}

	requestRelations(id, terme: string) {
		let raffinement = $("#show-relations-filters-raffinement-"+id);
		if (raffinement.hasClass("show-relations-filters-raffinement-selectionne")) {
			$(".show-relations-filters-raffinement").each(function() {
				$(this).removeClass("show-relations-filters-raffinement-selectionne")
			});
			this.relationsService.requestRelations(terme.split(">")[0], false);
		}
		else {
			$(".show-relations-filters-raffinement").each(function() {
				$(this).removeClass("show-relations-filters-raffinement-selectionne")
			});
			$("#show-relations-filters-raffinement-"+id).addClass("show-relations-filters-raffinement-selectionne");
			this.relationsService.requestRelations(terme, false);
		}
	}
}
