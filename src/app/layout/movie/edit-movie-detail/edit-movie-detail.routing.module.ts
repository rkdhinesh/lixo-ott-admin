import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditMovieDetailComponent } from './edit-movie-detail.component';

export const routes: Routes = [
  { path: '', component: EditMovieDetailComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EditMovieDetailRoutingModule { }
