import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SearchComponent } from './search/search/search.component';
import { ShowRelationsComponent } from './show-relations/show-relations/show-relations.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ShowRelationsFiltersComponent } from './show-relations/show-relations-filters/show-relations-filters.component';
import { AutocompleteComponent } from './search/autocomplete/autocomplete.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ShowRelationsComponent,
    BreadcrumbComponent,
    ShowRelationsFiltersComponent,
    AutocompleteComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
