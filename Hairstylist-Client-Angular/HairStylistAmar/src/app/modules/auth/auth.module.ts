import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SelectRoleComponent } from './select-role/select-role.component';
import { AuthLayoutModule } from 'src/app/layouts/auth-layout/auth-layout.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [LoginComponent, SelectRoleComponent],
  imports: [CommonModule, AuthRoutingModule, AuthLayoutModule,FormsModule ],
})
export class AuthModule {}
