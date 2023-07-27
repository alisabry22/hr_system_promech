import { TestBed } from '@angular/core/testing';

import { AlldepartmentService } from './alldepartment.service';

describe('AlldepartmentService', () => {
  let service: AlldepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlldepartmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
