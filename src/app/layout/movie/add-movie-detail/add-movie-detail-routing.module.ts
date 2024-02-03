import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddMovieDetailComponent } from './add-movie-detail.component';

export const routes: Routes = [
  { path: '', component: AddMovieDetailComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AddMovieDetailRoutingModule { }
