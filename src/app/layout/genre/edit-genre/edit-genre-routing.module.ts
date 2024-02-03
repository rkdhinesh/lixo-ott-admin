import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditGenreComponent } from './edit-genre.component';

export const routes: Routes = [
  { path: '', component: EditGenreComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EditGenreRoutingModule { }
