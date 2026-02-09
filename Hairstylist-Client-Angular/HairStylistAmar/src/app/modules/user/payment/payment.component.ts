import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BookingManageService } from '../../../services/bookings/booking-manage.service';
import { PaymentOrderService } from '../../../services/payments/payment-order.service';
import { PaymentVerifyService } from '../../../services/payments/payment-verify.service';

declare var Razorpay: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css'],
})
export class PaymentComponent implements OnInit {

  bookingId!: string;
  booking: any;
  loading = true;
  processing = false;

  // 🔔 Popup state
  showPopup = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'error';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingApi: BookingManageService,
    private orderApi: PaymentOrderService,
    private verifyApi: PaymentVerifyService,
    private zone: NgZone              // ✅ ADD THIS
  ) {}

  ngOnInit(): void {
    this.bookingId = this.route.snapshot.paramMap.get('bookingId')!;

    if (!this.bookingId) {
      this.openPopup('Invalid booking', 'error');
      return;
    }

    this.loadBookingDetails();
  }

  loadBookingDetails(): void {
    this.bookingApi.getBookingById(this.bookingId).subscribe({
      next: (res) => {
        this.booking = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.openPopup('Unable to load booking details', 'error');
      }
    });
  }

  payNow(): void {
    if (!this.booking || !this.booking.amount) {
      this.openPopup('Invalid booking amount', 'error');
      return;
    }

    if (this.processing) return;
    this.processing = true;

    this.orderApi.createOrder({
      bookingId: this.bookingId,
      amount: this.booking.amount
    }).subscribe({
      next: (order: any) => {
        this.openRazorpay(order);
      },
      error: () => {
        this.processing = false;
        this.openPopup('Payment initialization failed', 'error');
      }
    });
  }

openRazorpay(order: any): void {
  if (!order?.orderId || !order?.key) {
    this.processing = false;
    this.openPopup('Invalid payment order', 'error');
    return;
  }

  const options = {
    key: order.key,
    amount: order.amount,
    currency: 'INR',
    name: 'Hairvona',
    description: 'Batch Booking Payment',
    order_id: order.orderId,

    handler: (response: any) => {
      // ✅ Payment success → verify on backend
      this.zone.run(() => {
        this.verifyPayment(response);
      });
    },

    modal: {
      ondismiss: () => {
        // ❌ User closed Razorpay popup
        this.zone.run(() => {
          this.processing = false;
          this.openPopup('Payment cancelled by user', 'error');
        });
      }
    }
  };

  const rzp = new Razorpay(options);

  // ❌ PAYMENT FAILED (INSUFFICIENT FUNDS, NETWORK, ETC.)
  rzp.on('payment.failed', (response: any) => {
    this.zone.run(() => {
      this.processing = false;
      this.openPopup(
        response.error?.description || 'Payment failed. Please try again.',
        'error'
      );
    });
  });

  rzp.open();
}


  verifyPayment(response: any): void {

  this.verifyApi.verifyPayment({
    bookingId: this.bookingId,
    razorpayOrderId: response.razorpay_order_id,
    razorpayPaymentId: response.razorpay_payment_id,
    razorpaySignature: response.razorpay_signature
  }).subscribe({

    next: () => {
      this.zone.run(() => {   // 🔥 CRITICAL FIX
        this.processing = false;
        this.openPopup('Payment successful 🎉', 'success');
      });
    },

    error: () => {
      this.zone.run(() => {   // 🔥 CRITICAL FIX
        this.processing = false;
        this.openPopup('Payment verification failed', 'error');
      });
    }

  });
}


  openPopup(message: string, type: 'success' | 'error'): void {
    this.popupMessage = message;
    this.popupType = type;
    this.showPopup = true;
  }

 closePopup(): void {
  this.showPopup = false;

  if (this.popupType === 'success') {
    this.router.navigate(['/user/bookings']);
  }

  if (this.popupType === 'error') {
    // 🔁 Retry payment
    this.payNow();
  }
}

}
