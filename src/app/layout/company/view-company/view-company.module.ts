import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewCompanyRoutingModule } from './view-company-routing.module';
import { ViewCompanyComponent } from './view-company.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';
import { AgmCoreModule } from '@agm/core';
import { ViewVenueModule } from '../../venue/view/view-venue.module';
import { Data } from '../../../shared/data';
import { EditVenueModule } from '../../venue/edit/edit-venue.module';
import { VenueModule } from '../../venue/venue.module';

@NgModule({
  imports: [
    CommonModule,
    ViewCompanyRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    ViewVenueModule,
    EditVenueModule,
    VenueModule,
    FlexLayoutModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAzwRDOIWaOsBIXzql7u8SFIBc28Fq5gmI'
    }),
  ],
  providers: [TempDataService, Data],
  declarations: [ViewCompanyComponent]
})
export class ViewCompanyModule { }
