import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { UserRoutingModule } from './user-routing.module';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';
import { PaymentComponent } from './payment/payment.component';
import { UserDashboardComponent } from './dashboard/dashboard.component';
import { BookBatchComponent } from './book-batch/book-batch.component';
import { FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    UserDashboardComponent,
    UserBookingsComponent,
    PaymentComponent,
    BookBatchComponent,
    ProfileComponent
  ],
  imports: [CommonModule, HttpClientModule, UserRoutingModule, FormsModule],
})
export class UserModule {}
