import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddAuthorizationRoutingModule } from './add-authorization-routing.module';
import { AddAuthorizationComponent } from './add-authorization.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../../shared';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  declarations: [AddAuthorizationComponent],
  imports: [
    CommonModule,
    AddAuthorizationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule
  ],providers: [ TempDataService ]
})
export class AddAuthorizationModule { }
