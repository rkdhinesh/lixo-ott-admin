import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditCriticReviewComponent } from './edit-critic-review.component';
import { TempDataService } from '../../../../shared/temp-dataStore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../../shared';
import { MaterialModule } from '../../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [EditCriticReviewComponent],
  imports: [
    CommonModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule
  ],
  providers: [TempDataService]
})
export class EditCriticReviewModule { }
