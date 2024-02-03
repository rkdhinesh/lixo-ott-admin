import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCineastMemberComponent } from './edit-cineast-member.component';
import { EditCineastMemberRoutingModule } from './edit-cineast-member-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';

@NgModule({
  declarations: [EditCineastMemberComponent],
  imports: [
    CommonModule,
    EditCineastMemberRoutingModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  providers: [TempDataService]
})
export class EditCineastMemberModule {}
