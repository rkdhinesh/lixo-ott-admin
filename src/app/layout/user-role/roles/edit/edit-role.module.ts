import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../../shared';
import { MaterialModule } from '../../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../../shared/temp-dataStore';
import { EditRoleComponent } from './edit-role.component';
import { EditRoleRoutingModule } from './edit-role-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    EditRoleRoutingModule
  ],
  providers: [ TempDataService],
  declarations: [EditRoleComponent]
})
export class EditRoleModule { }
