import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditUserRoutingModule } from './edit-user-routing.module';
import { EditUserComponent } from './edit-user.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  
    imports: [
    CommonModule,
    EditUserRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule
  ],
  providers: [TempDataService],
  declarations: [EditUserComponent]
})
export class EditUserModule { }
