import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditPublishRoutingModule } from './edit-publish-routing.module';
import { EditPublishComponent } from './edit-publish.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';
import { DatePickerModule } from '../../../shared/modules/date-picker/date-picker.module';
import { ViewPublishModule } from '../view-publish/view-publish.module';
import { MatNativeDateModule } from '@angular/material/core';


@NgModule({
  imports: [
    EditPublishRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    CommonModule,
    DatePickerModule,
    ViewPublishModule,
    MatNativeDateModule,
  ],
  providers: [TempDataService],
  declarations: [EditPublishComponent]
})
export class EditPublishModule { }
