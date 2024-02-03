import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditLocalityComponent } from './edit-locality.component';
import { TempDataService } from '../../../shared/temp-dataStore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EditLocalityRoutingModule } from './edit-locality-routing.module';
import { FilterPipe } from './country.pipes';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    EditLocalityRoutingModule
  ],
  providers: [TempDataService],
  declarations: [EditLocalityComponent, FilterPipe]
})
export class EditLocalityModule { }
