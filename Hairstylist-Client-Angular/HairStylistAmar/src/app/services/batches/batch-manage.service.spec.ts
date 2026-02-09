import { TestBed } from '@angular/core/testing';

import { BatchManageService } from './batch-manage.service';

describe('BatchManageService', () => {
  let service: BatchManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BatchManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
