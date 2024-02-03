import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewMovieComponent } from './view-movie.component';

const routes: Routes = [
  { path: '', component: ViewMovieComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewMovieRoutingModule { }
