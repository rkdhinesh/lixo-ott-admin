import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserComponent } from './add-user.component';
import { AddUserRoutingModule } from './add-user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  imports: [ 
    CommonModule,
    AddUserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule
  ],
  providers: [TempDataService],
  declarations: [AddUserComponent]
})
export class AddUserModule { }
