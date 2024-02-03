import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewVenueComponent } from './view-venue.component';
export const routes: Routes = [
  { path: '', component: ViewVenueComponent },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ViewVenueRoutingModule { }
