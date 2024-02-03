import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRoleComponent } from './add-role.component';
import { AddRoleRoutingModule } from './add-role-routing.module';
import { PageHeaderModule } from '../../../../shared';
import { MaterialModule } from '../../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TempDataService } from '../../../../shared/temp-dataStore';

@NgModule({
  imports: [
    CommonModule,  
    AddRoleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
  ],
  providers: [ TempDataService],
  declarations: [AddRoleComponent]
})
export class AddRoleModule { }
