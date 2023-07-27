import { TestBed } from '@angular/core/testing';

import { GetemptimeService } from './getemptime.service';

describe('GetemptimeService', () => {
  let service: GetemptimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetemptimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
