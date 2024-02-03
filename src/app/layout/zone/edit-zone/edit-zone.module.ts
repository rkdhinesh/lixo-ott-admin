import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditZoneComponent } from './edit-zone.component';
import { TempDataService } from '../../../shared/temp-dataStore';
import { EditZoneRoutingModule } from './edit-zone-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../../shared';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    EditZoneRoutingModule
  ],
  providers: [ TempDataService],
  declarations: [EditZoneComponent]
})

export class EditZoneModule { }
