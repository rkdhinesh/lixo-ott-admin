import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewTaxRoutingModule } from './view-tax-routing.module';
import { ViewTaxComponent } from './view-tax.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  imports: [
    CommonModule,
    ViewTaxRoutingModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [ TempDataService],
  declarations: [ViewTaxComponent]
})
export class ViewTaxModule { }
