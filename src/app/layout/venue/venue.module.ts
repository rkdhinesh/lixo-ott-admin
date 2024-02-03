import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenueComponent } from './venue.component';
import { TempDataService } from '../../shared/temp-dataStore';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EditVenueModule } from './edit/edit-venue.module';
import { VenueRoutingModule } from './venue-routing.module';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../shared';
import { VenueFilterPipe } from './venue.pipes';
import { ViewVenueModule } from './view/view-venue.module';

@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    VenueRoutingModule,
    EditVenueModule,
    ViewVenueModule,
    FlexLayoutModule,
    FormsModule
],
providers: [ TempDataService ],
declarations: [ VenueComponent,VenueFilterPipe],
})
export class VenueModule { }
