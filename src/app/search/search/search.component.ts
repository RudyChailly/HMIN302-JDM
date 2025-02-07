import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RezoDumpService } from '../../rezo-dump/rezo-dump.service';
import { RelationsService } from '../../relations/relations.service';
import { StorageService } from '../../relations/storage/storage.service';
import { AutocompleteService } from '../autocomplete/autocomplete.service';
import { SearchService } from './search.service';
import { BreadcrumbService } from '../../breadcrumb/breadcrumb.service';
import $ from "jquery";

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

	saisie: string = "";
	searchForm: FormGroup;
	suggestionsTermes = [];

	constructor(
		private formBuilder: FormBuilder,
		private rezoDumpService: RezoDumpService,
		private relationsService: RelationsService,
		private autocompleteService: AutocompleteService,
		private storageService: StorageService,
		private searchService: SearchService,
		private breadcrumbService: BreadcrumbService
		) { }

	ngOnInit(): void {
		this.searchForm = this.formBuilder.group({
			terme: ''
		});
		this.searchService.saisieSubject.subscribe(saisie => {
			this.saisie = saisie;
			this.setInputValue(saisie);
		});
		this.onChanges();
	}

	focusout() {
		// this.autocompleteService.hide();
	}

	focusin() {
		if (this.saisie.length > 2) {
			this.autocompleteService.autocompletion(this.saisie);
		}
	}

	onChanges() {
		this.searchForm.get('terme').valueChanges.subscribe(saisie => {
			this.saisie = saisie;
			if (saisie.length > 0) {
				$("#search-form-button-search").removeClass("disabled");
				if (saisie.length > 2) {
					this.autocompleteService.autocompletion(saisie);
				}
				else {
					this.autocompleteService.resetSuggestions();
				}
			}
			else {
				$("#search-form-button-search").addClass("disabled");
				this.autocompleteService.resetSuggestions();
			}
		});
	}

	setInputValue(value: string) {
		$("#search-form-terme-input").val(value);
	}

	search() {
		let terme = this.saisie;
		if (terme != "") {
			this.relationsService.requestRelations(terme).then(relations => {
				console.log(relations);
				this.breadcrumbService.reset();
				this.breadcrumbService.add(terme);
			});
		}
	}

}
