import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApproveReviewRoutingModule } from './approve-review-routing.module';
import { ApproveReviewComponent } from './approve-review.component';

@NgModule({
  imports: [
    CommonModule,
    ApproveReviewRoutingModule
  ],
  declarations: [ApproveReviewComponent]
})
export class ApproveReviewModule { }
