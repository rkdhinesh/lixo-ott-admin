import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddLocalityComponent } from './add-locality.component';
import { TempDataService } from '../../../shared/temp-dataStore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddLocalityRoutingModule } from './add-locality-routing.module';
import { FilterPipe } from './country.pipes';

@NgModule({
  imports: [ 
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    CommonModule,
    AddLocalityRoutingModule],
  providers: [TempDataService],
  declarations: [AddLocalityComponent, FilterPipe]
})
export class AddLocalityModule { }
