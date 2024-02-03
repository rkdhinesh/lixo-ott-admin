import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRoleUserRoutingModule } from './add-role-user-routing.module';
import { AddRoleUserComponent } from './add-role-user.component';
import { TempDataService } from '../../../shared/temp-dataStore';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../../shared';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [AddRoleUserComponent],
  imports: [
    CommonModule,
    AddRoleUserRoutingModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    MatTableModule
  ],
  providers: [ TempDataService ]
})
export class AddRoleUserModule { }
