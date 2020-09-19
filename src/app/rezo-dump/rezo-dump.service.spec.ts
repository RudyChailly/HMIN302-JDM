import { TestBed } from '@angular/core/testing';

import { RezoDumpService } from './rezo-dump.service';

describe('RezoDumpService', () => {
  let service: RezoDumpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RezoDumpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
