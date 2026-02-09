import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InstructorRoutingModule } from './instructor-routing.module';

import { InstructorDashboardComponent } from './dashboard/dashboard.component';
import { InstructorBatchesComponent } from './batches/batches.component';
import { InstructorBookingsComponent } from './bookings/bookings.component';
import { CreateBatchComponent } from './create-batch/create-batch.component';
import { EditBatchComponent } from './edit-batch/edit-batch.component';
import { InstructorProfileComponent } from './Instructor-profile/profile.component';
import { CreateServiceComponent } from './create-service/create-service.component';

@NgModule({
  declarations: [
    InstructorDashboardComponent,
    InstructorBatchesComponent,
    InstructorBookingsComponent,
    CreateBatchComponent,
    EditBatchComponent,
    CreateServiceComponent,
    InstructorProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InstructorRoutingModule
  ]
})
export class InstructorModule {}
