import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';
import { EditFareComponent } from './edit-fare.component';
import { EditFareRoutingModule } from './edit-fare-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
EditFareRoutingModule  ],
  providers: [ TempDataService],
  declarations: [EditFareComponent]
})
export class EditFareModule { }
