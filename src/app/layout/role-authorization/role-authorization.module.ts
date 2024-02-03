import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoleAuthorizationRoutingModule } from './role-authorization-routing.module';
import { RoleAuthorizationComponent } from './role-authorization.component';
import { RouterModule } from '@angular/router';;
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { TempDataService } from '../../shared/temp-dataStore';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../shared';
import { EditRoleAuthorizationModule } from './edit-role-authorization/edit-role-authorization.module';

@NgModule({
  declarations: [RoleAuthorizationComponent],
  imports: [
    CommonModule,
    RoleAuthorizationRoutingModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    EditRoleAuthorizationModule,
    MatTableModule
  ],
  providers: [ TempDataService ]
})
export class RoleAuthorizationModule { }
