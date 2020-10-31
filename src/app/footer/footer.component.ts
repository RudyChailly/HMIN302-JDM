import { Component, OnInit } from '@angular/core';
import { StorageService } from '../relations/storage/storage.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(
  	private storageService: StorageService
  ) { }

  ngOnInit(): void {
  }

  printLocal() {
    console.log("CACHE : ")
    console.log(this.storageService.getRelations());
  }

  cleanLocal() {
  	this.storageService.cleanLocal();
  }

}
