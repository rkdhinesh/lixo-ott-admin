import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CineastRolesComponent } from './cineast-roles.component';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { CineastRolesRoutingModule } from './cineast-roles-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TempDataService } from '../../shared/temp-dataStore';
import { EditCineastRolesModule } from './edit-cineast-roles/edit-cineast-roles.module';

@NgModule({
  declarations: [CineastRolesComponent],
  imports: [
    CommonModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    CineastRolesRoutingModule,
    EditCineastRolesModule,
    FlexLayoutModule,
    FormsModule,
  ], providers: [TempDataService],
})
export class CineastRolesModule { }
