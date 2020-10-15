import { TestBed } from '@angular/core/testing';

import { ShowRelationsService } from './show-relations.service';

describe('ShowRelationsService', () => {
  let service: ShowRelationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowRelationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
