import { TestBed } from '@angular/core/testing';

import { TimerepoService } from './timerepo.service';

describe('TimerepoService', () => {
  let service: TimerepoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimerepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
