import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditUserRoleRoutingModule } from './edit-user-role-routing.module';
import { EditUserRoleComponent } from './edit-user-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { PageHeaderModule } from 'app/shared';
// import { MaterialModule } from 'app/shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../../shared';

@NgModule({
  declarations: [EditUserRoleComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    CommonModule,
    EditUserRoleRoutingModule
  ]
})
export class EditUserRoleModule { }
