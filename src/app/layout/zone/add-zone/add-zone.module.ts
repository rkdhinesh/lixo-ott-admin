import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddZoneComponent } from './add-zone.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddZoneRoutingModule } from './add-zone-routing.module';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    AddZoneRoutingModule],
  providers: [ TempDataService ],
  declarations: [AddZoneComponent]
})
export class AddZoneModule { }
