import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewComponent } from './review.component';
import { EditReviewComponent } from './edit-review/edit-review.component';


export const routes: Routes = [
  { path: '', component: ReviewComponent},
  { path: 'edit-review', component: EditReviewComponent}
];

@NgModule({
imports: [
  RouterModule.forChild(routes)
],
exports: [
  RouterModule
]
})
export class ReviewRoutingModule { }
