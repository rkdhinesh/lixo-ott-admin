import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TempDataService } from '../../shared/temp-dataStore';
import { ReviewRoutingModule } from './review-routing.module';
import { EditReviewModule } from './edit-review/edit-review.module';
import { ReviewComponent } from './review.component';
import { FilterPipe } from './review.pipes';

@NgModule({
  imports: [
        CommonModule,
        PageHeaderModule,
        MaterialModule,
        RouterModule,
        ReviewRoutingModule,
        EditReviewModule,        
        FlexLayoutModule,
        FormsModule
    ],
    providers: [ TempDataService ],
    declarations: [ ReviewComponent,FilterPipe],
})
export class ReviewModule { }
