import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewCityComponent } from './view-city.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PageHeaderModule } from '../../../shared';

@NgModule({
  declarations: [ViewCityComponent],
  imports: [
   
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    PageHeaderModule,
  ]
})
export class ViewCityModule { }
