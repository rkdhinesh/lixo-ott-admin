import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCineastRolesComponent } from './add-cineast-roles.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddCineastRolesRoutingModule } from './add-cineast-roles-routing.module';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';

@NgModule({
  declarations: [AddCineastRolesComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    AddCineastRolesRoutingModule
  ]
})
export class AddCineastRolesModule { }
