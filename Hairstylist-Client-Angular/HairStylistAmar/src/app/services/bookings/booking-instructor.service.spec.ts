import { TestBed } from '@angular/core/testing';

import { BookingInstructorService } from './booking-instructor.service';

describe('BookingInstructorService', () => {
  let service: BookingInstructorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingInstructorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
