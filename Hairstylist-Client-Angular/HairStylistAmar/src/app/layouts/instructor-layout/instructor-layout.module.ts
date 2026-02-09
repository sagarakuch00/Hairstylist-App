import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { InstructorLayoutComponent } from './instructor-layout.component';
import { SharedModule } from '../../shared/shared.module';
import { AuthLayoutModule } from "../auth-layout/auth-layout.module";

@NgModule({
  declarations: [
    InstructorLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule // ✅ REQUIRED for <app-navbar>
    ,
    AuthLayoutModule
],
  exports: [
    InstructorLayoutComponent
  ]
})
export class InstructorLayoutModule {}
