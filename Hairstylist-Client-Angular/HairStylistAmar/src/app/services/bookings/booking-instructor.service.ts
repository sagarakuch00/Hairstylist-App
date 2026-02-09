
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/core/api/api-constants.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingInstructorService {

  constructor(private http: HttpClient) {}

  
  getMyBookings(): Observable<any[]> {
    return this.http.get<any[]>(
      API.bookingsByInstructor
    );
  }
}
