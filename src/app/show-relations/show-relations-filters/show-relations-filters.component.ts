import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RezoDumpService } from '../../rezo-dump/rezo-dump.service';
import { RelationsService } from '../../relations/relations.service';
import { typeRelations, getRelationById } from '../../relations/relations.variables';
import $ from "jquery";

@Component({
	selector: 'app-show-relations-filters',
	templateUrl: './show-relations-filters.component.html',
	styleUrls: ['./show-relations-filters.component.css']
})
export class ShowRelationsFiltersComponent implements OnInit {

	showRelationsFiltersForm : FormGroup

	typeRelations;

	constructor(
		private formBuilder: FormBuilder,
		private rezoDumpService : RezoDumpService,
		private relationsService : RelationsService
	) { }

	ngOnInit(): void {
		this.typeRelations = typeRelations;
		this.showRelationsFiltersForm = this.formBuilder.group({
			relation: 5
		});
		let showRelationsFiltersTriAlpha = $("#show-relations-filters-tri-alpha");
		let showRelationsFiltersTriPoids = $("#show-relations-filters-tri-poids");
		showRelationsFiltersTriAlpha.click(function() {
			showRelationsFiltersTriPoids.removeClass("btn-secondary");
			showRelationsFiltersTriPoids.addClass("btn-outline-secondary");
			$(this).addClass("btn-secondary");
			$(this).removeClass("btn-outline-secondary");
		});
		showRelationsFiltersTriPoids.click(function() {
			showRelationsFiltersTriAlpha.removeClass("btn-secondary");
			showRelationsFiltersTriAlpha.addClass("btn-outline-secondary");
			$(this).addClass("btn-secondary");
			$(this).removeClass("btn-outline-secondary");
		});


		this.onChanges();
	}

	onChanges() {
		this.showRelationsFiltersForm.get("relation").valueChanges.subscribe(id => {
			this.rezoDumpService.requestRelations(this.relationsService.getTerme(), id);
		});
	}

}
