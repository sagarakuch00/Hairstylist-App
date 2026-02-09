import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './dashboard/dashboard.component';
import { UserBookingsComponent } from './user-bookings/user-bookings.component';
import { PaymentComponent } from './payment/payment.component';
import { AuthGuard } from 'src/app/core/roles/auth.guard.guard';
import { BookBatchComponent } from './book-batch/book-batch.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: UserDashboardComponent },
      { path: 'bookings', component: UserBookingsComponent },
      { path: 'book-batch', component: BookBatchComponent },
      { path: 'payment/:bookingId', component: PaymentComponent },
      { path: 'profile', component: ProfileComponent },

      // ✅ SAFE DEFAULT
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
