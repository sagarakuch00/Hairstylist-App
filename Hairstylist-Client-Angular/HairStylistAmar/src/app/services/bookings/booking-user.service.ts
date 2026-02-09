import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API } from 'src/app/core/api/api-constants.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingUserService {

  constructor(private http: HttpClient) {}


getBookingsByUser(userId: string) {
  return this.http.get<any[]>(`${API.bookings}/user/${userId}`);
}

createBooking(data: any) {
  return this.http.post(`${API.bookings}`, data);
}



  
 cancelBooking(bookingId: string) {
  return this.http.delete(
    `${API.bookings}/cancel/${bookingId}`
  );
}
}
