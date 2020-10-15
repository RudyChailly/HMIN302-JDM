import { Component, OnInit, Input } from '@angular/core';
import { AutocompleteService } from './autocomplete.service';
import { SearchService } from '../search/search.service';

@Component({
	selector: 'app-autocomplete',
	templateUrl: './autocomplete.component.html',
	styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {

	suggestions: Array<string>;
	constructor(
		private autocompleteService : AutocompleteService,
		private searchService : SearchService
	) { }

	ngOnInit(): void {
		this.autocompleteService.suggestionsSubject.subscribe(suggestions => {
			this.suggestions = suggestions;
		});
	}

	select(suggestion: string) {
		this.searchService.setSaisie(suggestion);
		this.autocompleteService.setSuggestions([]);
	}

}
