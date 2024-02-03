import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewFareRoutingModule } from './view-fare-routing.module';
import { ViewFareComponent } from './view-fare.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../../shared';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  imports: [
    CommonModule,
    ViewFareRoutingModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [ TempDataService],
  declarations: [ViewFareComponent]
})
export class ViewFareModule { }
