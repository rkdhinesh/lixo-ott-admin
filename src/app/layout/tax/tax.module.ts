import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaxRoutingModule } from './tax-routing.module';
import { TaxComponent } from './tax.component';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TempDataService } from '../../shared/temp-dataStore';
import { ViewTaxModule } from './view-tax/view-tax.module';
import { EditTaxModule } from './edit-tax/edit-tax.module';
import { FilterPipe } from './tax.pipes';




@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,       
    FlexLayoutModule,
    FormsModule,
    TaxRoutingModule,
    ViewTaxModule,
    EditTaxModule,
  ],
  providers: [ TempDataService ],
  declarations: [TaxComponent,FilterPipe]
})
export class TaxModule { }
