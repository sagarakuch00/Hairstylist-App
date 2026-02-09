import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SelectRoleComponent } from './select-role/select-role.component';

const routes: Routes = [
  {
    path: '',
    children: [
      
      { path: '', component: LoginComponent },

      
      { path: 'login', component: LoginComponent },

      
      { path: 'select-role', component: SelectRoleComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
