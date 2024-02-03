import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoxOfficeUserRoleRoutingModule } from './box-office-user-role-routing.module';
import { BoxOfficeUserRoleComponent } from './box-office-user-role.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { EditUserRoleModule } from './edit-user-role/edit-user-role.module';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { TempDataService } from '../../shared/temp-dataStore';

@NgModule({
  declarations: [BoxOfficeUserRoleComponent],
  imports: [
    CommonModule,
    BoxOfficeUserRoleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    EditUserRoleModule
  ],
  providers: [TempDataService],
})
export class BoxOfficeUserRoleModule { }
