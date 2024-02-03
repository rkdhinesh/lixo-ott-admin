import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCityComponent } from './add-city.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PageHeaderModule } from '../../../shared';

@NgModule({
  declarations: [AddCityComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    CommonModule,
    PageHeaderModule,
  ]
})
export class AddCityModule { }
