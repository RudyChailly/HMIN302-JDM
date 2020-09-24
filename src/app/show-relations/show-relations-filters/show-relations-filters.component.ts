import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RezoDumpService } from '../../rezo-dump/rezo-dump.service';
import { RelationsService } from '../../relations/relations.service';

@Component({
	selector: 'app-show-relations-filters',
	templateUrl: './show-relations-filters.component.html',
	styleUrls: ['./show-relations-filters.component.css']
})
export class ShowRelationsFiltersComponent implements OnInit {

	showRelationsFiltersForm : FormGroup

	relations = [
		{"id": 5, "nom": "Synonymes"},
		{"id": 6, "nom": "Génériques"}
	];

	constructor(
		private formBuilder: FormBuilder,
		private rezoDumpService : RezoDumpService,
		private relationsService : RelationsService
	) { }

	ngOnInit(): void {
		this.showRelationsFiltersForm = this.formBuilder.group({
			relation: ''
		})
		this.onChanges();
	}

	onChanges() {
		this.showRelationsFiltersForm.get("relation").valueChanges.subscribe(relation => {
			this.rezoDumpService.requestRelations(this.relationsService.getTerme(), relation);
		});
	}

}
