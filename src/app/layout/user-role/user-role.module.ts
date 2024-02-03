import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoleRoutingModule } from './user-role-routing.module';
import { UserRoleComponent } from './user-role.component';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TempDataService } from '../../shared/temp-dataStore';
import { EditUserModule } from './edit-user/edit-user.module';
import { DatePickerModule } from '../../shared/modules/date-picker/date-picker.module';

@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    UserRoleRoutingModule,
    FlexLayoutModule,
    FormsModule,
    EditUserModule,
    DatePickerModule

  ],
  providers: [TempDataService],
  declarations: [UserRoleComponent]
})
export class UserRoleModule { }
