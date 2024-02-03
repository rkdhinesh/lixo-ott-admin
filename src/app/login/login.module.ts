import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/components/MaterialModule';
import { LayoutModule } from '../layout/layout.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    LoginRoutingModule,
    LayoutModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }