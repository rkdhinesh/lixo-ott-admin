import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewVenueComponent } from './view-venue.component';
import { TempDataService } from '../../../shared/temp-dataStore';
import { ViewVenueRoutingModule } from './view-venue-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { Data } from '../../../shared/data';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ViewVenueRoutingModule
  ],
  providers: [ TempDataService,Data],
  declarations: [ViewVenueComponent]
})
export class ViewVenueModule { }
