import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API } from 'src/app/core/api/api-constants.service';
import { BookingUserService } from 'src/app/services/bookings/booking-user.service';

@Component({
  selector: 'app-book-batch',
  templateUrl: './book-batch.component.html',
  styleUrls: ['./book-batch.component.css'],
})
export class BookBatchComponent implements OnInit {

  services: any[] = [];
  batches: any[] = [];
  selectedService: any = null;

  loading = true;
  activeBatchId: string | null = null;
  studentMobile = '';
  processing = false;

  FILE_BASE = 'https://localhost:7154';

  constructor(
    private http: HttpClient,
    private router: Router,
    private bookingApi: BookingUserService
  ) {}

  ngOnInit(): void {
    this.loadServices();
  }

  // 🔹 Load services
  loadServices(): void {
    this.http.get<any[]>(API.services).subscribe({
      next: res => {
        this.services = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  // 🔹 Select service
  selectService(service: any): void {
    if (this.selectedService?.serviceId === service.serviceId) {
      this.selectedService = null;
      this.batches = [];
      return;
    }

    this.selectedService = service;
    this.activeBatchId = null;
    this.studentMobile = '';

    this.loadBatches(service.serviceId);
  }

  // 🔹 Load batches
  loadBatches(serviceId: string): void {
    this.http
      .get<any[]>(`${API.batches}/service/${serviceId}`)
      .subscribe(res => {
        this.batches = res;

        if (res.length > 0) {
          this.selectedService.instructor = res[0].instructor;
        }
      });
  }

  // 🔹 Open mobile input
  openMobileInput(batchId: string): void {
    this.activeBatchId = batchId;
    this.studentMobile = '';   // ✅ reset every time
  }

  // 🔹 Confirm booking
  confirmBooking(batchId: string): void {

    const mobile = this.studentMobile?.trim();

    if (this.processing || !mobile || mobile.length !== 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('Please login again');
      return;
    }

    this.processing = true;

    this.bookingApi.createBooking({
      userId,
      batchId,
      studentMobile: mobile
    }).subscribe({
      next: (res: any) => {
        this.processing = false;
        this.router.navigate(['/user/payment', res.bookingId]);
      },
      error: (err) => {
        console.error('Booking failed', err);
        this.processing = false;
        alert(err?.error || 'Booking failed');
      }
    });
  }

  // 🔹 Instructor photo
  getInstructorPhoto(instructor: any): string {
    if (!instructor || !instructor.photoUrl) {
      return 'assets/user.png';
    }

    if (instructor.photoUrl.startsWith('http')) {
      return instructor.photoUrl;
    }

    return `${this.FILE_BASE}${instructor.photoUrl}`;
  }
}
