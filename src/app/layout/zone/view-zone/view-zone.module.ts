import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewZoneRoutingModule } from './view-zone-routing.module';
import { ViewZoneComponent } from './view-zone.component';
import { FormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ViewZoneRoutingModule
  ],
  providers: [ TempDataService],
  declarations: [ViewZoneComponent]
})
export class ViewZoneModule { }
