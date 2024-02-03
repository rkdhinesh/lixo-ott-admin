import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewLocalityRoutingModule } from './view-locality-routing.module';
import { ViewLocalityComponent } from './view-locality.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';
import { FilterPipe } from './country.pipes';


@NgModule({
  imports: [
    CommonModule,
    ViewLocalityRoutingModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [TempDataService],
  declarations: [ViewLocalityComponent,FilterPipe]
})
export class ViewLocalityModule { }
