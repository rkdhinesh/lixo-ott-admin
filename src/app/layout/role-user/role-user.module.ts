import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleUserRoutingModule } from './role-user-routing.module';
import { RoleUserComponent } from './role-user.component';
import { TempDataService } from '../../shared/temp-dataStore';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../shared';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { EditRoleUserModule } from './edit-role-user/edit-role-user.module';

@NgModule({
  declarations: [RoleUserComponent],
  imports: [
    CommonModule,
    RoleUserRoutingModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    EditRoleUserModule,
    MatTableModule
  ],
  providers: [ TempDataService ]
})
export class RoleUserModule { }
