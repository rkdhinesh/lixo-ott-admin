import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';


import { TempDataService } from '../../shared/temp-dataStore';

import { MatTableModule } from '@angular/material/table';
import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ResetPasswordRoutingModule, 
    PageHeaderModule,
    MaterialModule,
    RouterModule,        
    FlexLayoutModule,
    FormsModule,
    MatTableModule
  ],
  providers: [ TempDataService ],
  declarations: [ResetPasswordComponent]
})
export class ResetPasswordModule { }
