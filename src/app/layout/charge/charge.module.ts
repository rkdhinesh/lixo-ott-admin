import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChargeRoutingModule } from './charge-routing.module';
import { ChargeComponent } from './charge.component';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { ViewChargeModule } from './view-charge/view-charge.module';
import { EditChargeModule } from './edit-charge/edit-charge.module';
import { TempDataService } from '../../shared/temp-dataStore';
import { FilterPipe } from './charge.pipes';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    ChargeRoutingModule, 
    PageHeaderModule,
    MaterialModule,
    RouterModule,        
    FlexLayoutModule,
    FormsModule,
    ViewChargeModule,
    EditChargeModule,
    MatTableModule
  ],
  providers: [ TempDataService ],
  declarations: [ChargeComponent,FilterPipe]
})
export class ChargeModule { }