import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';
import { EditReviewRoutingModule } from './edit-review-routing.module';
import { EditReviewComponent } from './edit-review.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    EditReviewRoutingModule
  ],
  providers: [ TempDataService],
  declarations: [EditReviewComponent]
})
export class EditReviewModule { }
