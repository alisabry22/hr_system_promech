import { TestBed } from '@angular/core/testing';

import { TransrepoService } from './transrepo.service';

describe('TransrepoService', () => {
  let service: TransrepoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TransrepoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
