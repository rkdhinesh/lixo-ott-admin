import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditVenueComponent } from './edit-venue.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EditVenueRoutingModule } from './edit-routing.module';
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
    EditVenueRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAzwRDOIWaOsBIXzql7u8SFIBc28Fq5gmI'
    }),
  ],
  providers: [TempDataService],
  declarations: [EditVenueComponent]
})
export class EditVenueModule { }
