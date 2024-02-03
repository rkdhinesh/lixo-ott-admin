import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddChargeRoutingModule } from './add-charge-routing.module';
import { AddChargeComponent } from './add-charge.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  imports: [
    CommonModule,
    AddChargeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
  ],
  providers: [ TempDataService],
  declarations: [AddChargeComponent]
})
export class AddChargeModule { }
