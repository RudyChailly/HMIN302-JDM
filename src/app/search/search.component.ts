import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

	searchForm: FormGroup;

	constructor(
		private formBuilder: FormBuilder
		) { }

	ngOnInit(): void {
		this.searchForm = this.formBuilder.group({
			terme: ''
		})
	}

	search() {

	}

}
