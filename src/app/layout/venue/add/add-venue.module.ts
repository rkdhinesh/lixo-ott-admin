import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddVenueComponent } from './add-venue.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddVenueRoutingModule } from './add-venue-routing.module';
import { TempDataService } from '../../../shared/temp-dataStore';
import { AgmCoreModule } from '@agm/core';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    HttpClientModule,
    AddVenueRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAzwRDOIWaOsBIXzql7u8SFIBc28Fq5gmI'
    }),
  ],
  providers: [ TempDataService],
  declarations: [AddVenueComponent]
})
export class AddVenueModule { }
