import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewMovieDetailComponent } from './view-movie-detail.component';

export const routes: Routes = [
  { path: '', component: ViewMovieDetailComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ViewMovieDetailRoutingModule { }
