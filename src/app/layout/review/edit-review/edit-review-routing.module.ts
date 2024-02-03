import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditReviewComponent } from './edit-review.component';

export const routes: Routes = [
  { path: '', component: EditReviewComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EditReviewRoutingModule { }
