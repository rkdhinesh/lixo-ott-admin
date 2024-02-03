import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddRoleAuthorizationRoutingModule } from './add-role-authorization-routing.module';
import { AddRoleAuthorizationComponent } from './add-role-authorization.component';
import { RouterModule } from '@angular/router';;
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { TempDataService } from '../../../shared/temp-dataStore';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../../shared';

@NgModule({
  declarations: [AddRoleAuthorizationComponent],
  imports: [
    CommonModule,
    AddRoleAuthorizationRoutingModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    MatTableModule
  ],
  providers: [ TempDataService ]
})
export class AddRoleAuthorizationModule { }
