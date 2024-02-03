import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MovieComponent } from './movie.component';
import { EditMovieComponent } from './edit-movie/edit-movie.component';
import { ViewMovieComponent } from './view-movie/view-movie.component';
import { AddMovieDetailComponent } from './add-movie-detail/add-movie-detail.component';
import { ViewMovieDetailComponent } from './view-movie-detail/view-movie-detail.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';

export const routes: Routes = [
  { path: '', component: MovieComponent},
  { path: 'edit-movie', component: EditMovieComponent},
  { path: 'view-movie', component: ViewMovieComponent},
  { path: 'movie-detail', component: MovieDetailComponent},
  { path: 'add-movie-detail', component: AddMovieDetailComponent},
  { path: 'view-movie-detail', component: ViewMovieDetailComponent}
];

@NgModule({
imports: [
  RouterModule.forChild(routes)
],
exports: [
  RouterModule
]
})
export class MovieRoutingModule { }
