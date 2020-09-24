import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRelationsFiltersComponent } from './show-relations-filters.component';

describe('ShowRelationsFiltersComponent', () => {
  let component: ShowRelationsFiltersComponent;
  let fixture: ComponentFixture<ShowRelationsFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowRelationsFiltersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRelationsFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
