import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeolocationRoutingModule } from './geolocation-routing.module';
import { GeolocationComponent } from './geolocation.component';

@NgModule({
  imports: [
    CommonModule,
    GeolocationRoutingModule
  ],
  declarations: [GeolocationComponent]
})
export class GeolocationModule { }