import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { serverURL } from '../../app.config';
import $ from "jquery";


const httpOptions = {
	headers: new HttpHeaders ({
		"Access-Control-Allow-Methods": "GET,POST",
		"Access-Control-Allow-Headers": "Content-type",
		"Content-Type": "application/json",
		"Access-Control-Allow-Origin": "*",
	})
}
@Injectable({
	providedIn: 'root'
})
export class AutocompleteService {

	suggestionsSubject = new Subject<any>();

	constructor(
		private http: HttpClient
	) { }

	autocompletion(saisie: string) {
		this.resetSuggestions();
		return new Promise(resolve => this.http.get(serverURL +'/autocomplete/'+encodeURIComponent(saisie)).subscribe(termes => {
			let suggestions = [];
			Object(termes).forEach(terme => {suggestions.push(decodeURIComponent(terme.t))});
			this.suggestionsSubject.next(suggestions);
		}));
	}

	setSuggestions(suggestions: Array<any>) {
		this.suggestionsSubject.next(suggestions);
	}

	resetSuggestions() {
		this.suggestionsSubject.next([]);
	}

	hide() {
		$("#search-form-terme-autocomplete").hide();
	}
}
