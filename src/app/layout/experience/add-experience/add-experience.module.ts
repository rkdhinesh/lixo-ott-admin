import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddExperienceRoutingModule } from './add-experience-routing.module';
import { AddExperienceComponent } from './add-experience.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [AddExperienceComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    AddExperienceRoutingModule
  ]
})
export class AddExperienceModule { }
