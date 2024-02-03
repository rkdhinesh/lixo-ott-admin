import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserRoleRoutingModule } from './add-user-role-routing.module';
import { AddUserRoleComponent } from './add-user-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../../shared';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  declarations: [AddUserRoleComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    PageHeaderModule,
    RouterModule,
    FlexLayoutModule,
    CommonModule,
    AddUserRoleRoutingModule
  ],
  providers: [TempDataService],
})
export class AddUserRoleModule { }
