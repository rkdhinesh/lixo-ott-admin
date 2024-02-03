import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddTaxRoutingModule } from './add-tax-routing.module';
import { AddTaxComponent } from './add-tax.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../../shared';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  imports: [
    CommonModule,
    AddTaxRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ],
    providers: [ TempDataService],
  declarations: [AddTaxComponent]
})
export class AddTaxModule { }
