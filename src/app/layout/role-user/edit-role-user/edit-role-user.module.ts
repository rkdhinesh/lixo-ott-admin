import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditRoleUserRoutingModule } from './edit-role-user-routing.module';
import { EditRoleUserComponent } from './edit-role-user.component';
import { TempDataService } from '../../../shared/temp-dataStore';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../../shared';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [EditRoleUserComponent],
  imports: [
    CommonModule,
    EditRoleUserRoutingModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    MatTableModule
  ],
  providers: [ TempDataService ]
})
export class EditRoleUserModule { }
