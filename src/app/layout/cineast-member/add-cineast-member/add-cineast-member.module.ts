import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddCineastMemberRoutingModule } from './add-cineast-member-routing.module';
import { AddCineastMemberComponent } from './add-cineast-member.component';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { PageHeaderModule } from '../../../shared';

@NgModule({
  declarations: [AddCineastMemberComponent],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    CommonModule,
    PageHeaderModule,

    AddCineastMemberRoutingModule
  ]
})
export class AddCineastMemberModule { }
