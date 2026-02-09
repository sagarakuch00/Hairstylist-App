import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../core/roles/auth.guard.guard';
import { InstructorGuard } from '../../core/roles/instructor.guard.guard';

import { InstructorDashboardComponent } from './dashboard/dashboard.component';
import { InstructorBatchesComponent } from './batches/batches.component';
import { InstructorBookingsComponent } from './bookings/bookings.component';
import { CreateBatchComponent } from './create-batch/create-batch.component';
import { EditBatchComponent } from './edit-batch/edit-batch.component';
import { CreateServiceComponent } from './create-service/create-service.component';
import { InstructorProfileComponent } from './Instructor-profile/profile.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard, InstructorGuard],
    children: [
      { path: 'dashboard', component: InstructorDashboardComponent },
      { path: 'batches', component: InstructorBatchesComponent },
      { path: 'bookings', component: InstructorBookingsComponent },
      { path: 'create-batch', component: CreateBatchComponent },
      { path: 'edit-batch/:batchId', component: EditBatchComponent },
      { path: 'create-service', component: CreateServiceComponent },
      {path: 'profile',component: InstructorProfileComponent},
      {path: 'services/create',component: CreateServiceComponent},
      {path: 'services/edit/:id',component: CreateServiceComponent},
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule {}
