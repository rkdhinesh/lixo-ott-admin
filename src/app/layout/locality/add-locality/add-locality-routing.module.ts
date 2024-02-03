import { NgModule } from '@angular/core';
import { AddLocalityComponent } from './add-locality.component';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  { path: '', component: AddLocalityComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AddLocalityRoutingModule { }
