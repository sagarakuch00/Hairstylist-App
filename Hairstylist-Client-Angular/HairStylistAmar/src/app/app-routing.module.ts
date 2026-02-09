import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';

const routes: Routes = [

  
 {
  path: '',
  component: PublicLayoutComponent,
  children: [
    {
      path: '',
      loadChildren: () =>
        import('./modules/public/public.module').then(m => m.PublicModule)
    },
    {
      path: 'user',
      loadChildren: () =>
        import('./modules/user/user.module').then(m => m.UserModule)
    },
    {
      path: 'instructor',
      loadChildren: () =>
        import('./modules/instructor/instructor.module').then(m => m.InstructorModule)
    }
  ]
}
,

  
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
