
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/core/api/api-constants.service';
import { Observable } from 'rxjs';
import { BookingDetails } from 'src/app/interfaces/booking-details.interface';

@Injectable({
  providedIn: 'root',
})
export class BookingManageService {
  constructor(private http: HttpClient) {}

  
  createBooking(data: any): Observable<any> {
    return this.http.post<any>(`${API.bookings}`, data);
  }

  
  getBookingById(id: string): Observable<BookingDetails> {
    return this.http.get<BookingDetails>(`${API.bookings}/details/${id}`);
  }

cancelBooking(bookingId: string) {
  return this.http.delete(
    `${API.bookings}/cancel/${bookingId}`
  );
}



}
