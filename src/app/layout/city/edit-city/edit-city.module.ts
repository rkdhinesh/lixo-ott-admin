import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCityComponent } from './edit-city.component';
import { PageHeaderModule } from '../../../shared';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [EditCityComponent],
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
export class EditCityModule { }
