import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCineastRolesComponent } from './edit-cineast-roles.component';
import { EditCineastRolesRoutingModule } from './edit-cineast-roles-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [EditCineastRolesComponent],
  imports: [
    CommonModule,
    EditCineastRolesRoutingModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ]
})
export class EditCineastRolesModule { }
