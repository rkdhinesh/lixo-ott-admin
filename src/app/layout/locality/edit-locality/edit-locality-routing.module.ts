import { NgModule } from '@angular/core';
import { EditLocalityComponent } from './edit-locality.component';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  { path: '', component: EditLocalityComponent },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EditLocalityRoutingModule { }
