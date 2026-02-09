import { TestBed } from '@angular/core/testing';

import { BookingUserService } from './booking-user.service';

describe('BookingUserService', () => {
  let service: BookingUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
