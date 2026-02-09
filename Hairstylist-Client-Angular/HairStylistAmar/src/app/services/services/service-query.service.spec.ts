import { TestBed } from '@angular/core/testing';

import { ServiceQueryService } from './service-query.service';

describe('ServiceQueryService', () => {
  let service: ServiceQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
