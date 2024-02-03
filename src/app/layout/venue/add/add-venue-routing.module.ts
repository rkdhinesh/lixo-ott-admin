import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddVenueComponent } from './add-venue.component';
export const routes: Routes = [
    { path: '', component: AddVenueComponent},

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AddVenueRoutingModule { }
