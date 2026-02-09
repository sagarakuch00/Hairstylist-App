import { TestBed } from '@angular/core/testing';

import { BookingManageService } from './booking-manage.service';

describe('BookingManageService', () => {
  let service: BookingManageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingManageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
