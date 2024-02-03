import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditAuthorizationRoutingModule } from './edit-authorization-routing.module';
import { EditAuthorizationComponent } from './edit-authorization.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  declarations: [EditAuthorizationComponent],
  imports: [
    CommonModule,
    EditAuthorizationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule
  ],providers: [ TempDataService ]
})
export class EditAuthorizationModule { }
