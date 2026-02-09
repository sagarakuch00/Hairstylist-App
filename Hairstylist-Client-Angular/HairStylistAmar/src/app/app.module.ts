import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';


import { UserLayoutModule } from './layouts/user-layout/user-layout.module';
import { PublicLayoutModule } from './layouts/public-layout/public-layout.module';
import { InstructorLayoutModule } from './layouts/instructor-layout/instructor-layout.module';
import { AuthLayoutModule } from './layouts/auth-layout/auth-layout.module';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent   
  ],
  imports: [
    BrowserModule,
    HttpClientModule,

    AppRoutingModule,
    CoreModule,
    
    AuthLayoutModule,
    PublicLayoutModule,
    UserLayoutModule,
    InstructorLayoutModule
  ],
  providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }
],
  bootstrap: [AppComponent],
})
export class AppModule {}
