import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizationRoutingModule } from './authorization-routing.module';
import { AuthorizationComponent } from './authorization.component';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../..//shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTableModule } from '@angular/material/table';
import { TempDataService } from '../../shared/temp-dataStore';
import { EditAuthorizationModule } from './edit-authorization/edit-authorization.module';

@NgModule({
  declarations: [AuthorizationComponent],
  imports: [
    CommonModule,
    AuthorizationRoutingModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    FormsModule,
    MatTableModule,
    EditAuthorizationModule
  ],
  providers: [ TempDataService ]
})
export class AuthorizationModule { }
