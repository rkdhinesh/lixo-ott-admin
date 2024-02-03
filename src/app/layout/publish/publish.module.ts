import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishRoutingModule } from './publish-routing.module';
import { PublishComponent } from './publish.component';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { FlexLayoutModule } from '../../../../node_modules/@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '../../../../node_modules/@angular/forms';
import { DatePickerModule } from '../../shared/modules/date-picker/date-picker.module';
import { TempDataService } from '../../shared/temp-dataStore';
import { ShowPublishTableComponent } from './show-publish-table/show-publish-table.component';
import { ViewPublishModule } from './view-publish/view-publish.module';
import { FilterPipe } from './publish.pipes';
@NgModule({
  imports: [
    CommonModule,
    PublishRoutingModule,
    PageHeaderModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule,
    ViewPublishModule
  ],
  //entryComponents: [ShowPublishTableComponent],

  providers: [TempDataService],

  declarations: [ShowPublishTableComponent,PublishComponent,FilterPipe]
})
export class PublishModule { }
