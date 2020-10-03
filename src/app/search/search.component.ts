import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RezoDumpService } from '../rezo-dump/rezo-dump.service';
import { RelationsService } from '../relations/relations.service';
import { AutocompleteService } from './autocomplete.service';
import $ from "jquery";

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

	searchForm: FormGroup;
	suggestionsTermes = [];

	constructor(
		private formBuilder: FormBuilder,
		private rezoDumpService: RezoDumpService,
		private relationsService: RelationsService,
		private autocompleteService: AutocompleteService
	) { }

	ngOnInit(): void {
		this.searchForm = this.formBuilder.group({
			terme: ''
		});
		this.autocompleteService.termesSubject.subscribe(termes => {
			this.suggestionsTermes = termes;
		});
		this.onChanges();
	}

	onChanges() {
		this.searchForm.get('terme').valueChanges.subscribe(saisie => {
			this.autocompleteService.autocompletion(saisie);
		});
	}

	search() {
		let terme = this.searchForm.get("terme").value;
		this.rezoDumpService.requestRelations(terme, this.relationsService.getTypeRelation().id);
		this.relationsService.setHistoriqueTermes([{"terme": terme, "relation": null}]);
		this.relationsService.setTerme(terme);
	}

	selectSuggestion(terme: string) {
		$("#search-form-terme-input").val(terme);
		this.suggestionsTermes = [];
	}

}
