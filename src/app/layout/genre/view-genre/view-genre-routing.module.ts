import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewGenreComponent } from './view-genre.component';

const routes: Routes = [
  { path: '', component: ViewGenreComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewGenreRoutingModule { }
