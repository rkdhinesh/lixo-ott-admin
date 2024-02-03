import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenreComponent } from './genre.component';
import { EditGenreComponent } from './edit-genre/edit-genre.component';
import { ViewGenreComponent } from './view-genre/view-genre.component';

export const routes: Routes = [
  { path: '', component: GenreComponent},
  { path: 'edit-genre', component: EditGenreComponent},
  { path: 'view-genre', component: ViewGenreComponent}
];

@NgModule({
imports: [
  RouterModule.forChild(routes)
],
exports: [
  RouterModule
]
})
export class GenreRoutingModule { }
