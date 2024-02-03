import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovePublishComponent } from './approve-publish.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ViewPublishRoutingModule } from '../view-publish/view-publish-routing.module';
import { DatePickerModule } from '../../../shared/modules/date-picker/date-picker.module';
import { PageHeaderModule } from '../../../shared';
import { TempDataService } from '../../../shared/temp-dataStore';
import { MaterialModule } from '../../../shared/components/MaterialModule';

@NgModule({
  declarations: [ApprovePublishComponent],
  providers: [TempDataService],
  imports: [
    CommonModule,
    ViewPublishRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    DatePickerModule 
  ]
})
export class ApprovePublishModule { }
