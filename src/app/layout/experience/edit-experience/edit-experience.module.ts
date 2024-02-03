import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditExperienceRoutingModule } from './edit-experience-routing.module';
import { EditExperienceComponent } from './edit-experience.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../..//shared/temp-dataStore';

@NgModule({
  declarations: [EditExperienceComponent],
  providers: [ TempDataService],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    EditExperienceRoutingModule
  ]
}) 
export class EditExperienceModule { }
