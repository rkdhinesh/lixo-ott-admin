import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { PageHeaderModule } from '../../../shared';
import { RouterModule } from '@angular/router';;
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { EditRoleModule } from './edit/edit-role.module';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  imports: [
    CommonModule,
    RolesRoutingModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    MatTableModule,
    EditRoleModule
  ],
  providers: [ TempDataService ],
  declarations: [RolesComponent]
})
export class RolesModule { }
