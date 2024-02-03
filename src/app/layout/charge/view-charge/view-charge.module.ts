import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewChargeRoutingModule } from './view-charge-routing.module';
import { ViewChargeComponent } from './view-charge.component';
import { TempDataService } from '../../../shared/temp-dataStore';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    ViewChargeRoutingModule,FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [ TempDataService],
  declarations: [ViewChargeComponent]
})
export class ViewChargeModule { }
