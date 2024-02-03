import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewRoleAuthorizationRoutingModule } from './view-role-authorization-routing.module';
import { ViewRoleAuthorizationComponent } from './view-role-authorization.component';
import { RouterModule } from '@angular/router';;
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { TempDataService } from '../../../shared/temp-dataStore';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../../shared';

@NgModule({
  declarations: [ViewRoleAuthorizationComponent],
  imports: [
    CommonModule,
    ViewRoleAuthorizationRoutingModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    MatTableModule
  ],
  providers: [ TempDataService ]
})
export class ViewRoleAuthorizationModule { }
