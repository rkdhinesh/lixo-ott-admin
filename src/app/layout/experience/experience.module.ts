import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExperienceRoutingModule } from './experience-routing.module';
import { ExperienceComponent } from './experience.component';
import { EditExperienceModule } from './edit-experience/edit-experience.module';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { TempDataService } from '../../shared/temp-dataStore';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../shared';

@NgModule({
  declarations: [ExperienceComponent],
  imports: [
    CommonModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    ExperienceRoutingModule,
    EditExperienceModule,
    FlexLayoutModule,
    FormsModule
  ],
  providers: [TempDataService],
})
export class ExperienceModule { }
