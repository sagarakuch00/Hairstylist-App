import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PublicLayoutComponent } from './public-layout.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    PublicLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule   
  ],
  exports: [
    PublicLayoutComponent
  ]
})
export class PublicLayoutModule {}
