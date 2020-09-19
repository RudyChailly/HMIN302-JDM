import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { RezoDumpService } from '../rezo-dump/rezo-dump.service';

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

	searchForm: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private rezoDumpService: RezoDumpService
	) { }

	ngOnInit(): void {
		this.searchForm = this.formBuilder.group({
			terme: ''
		})
	}

	search() {
		this.rezoDumpService.requestRelations("chien");
	}

}
