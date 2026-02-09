import { TestBed } from '@angular/core/testing';

import { ServiceManageService } from './service-manage.service';

describe('ServiceManageService', () => {
  let service: ServiceManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
