import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditChargeRoutingModule } from './edit-charge-routing.module';
import { EditChargeComponent } from './edit-charge.component';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  imports: [
    CommonModule,
    EditChargeRoutingModule,FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [ TempDataService],
  declarations: [EditChargeComponent]
})
export class EditChargeModule { }
