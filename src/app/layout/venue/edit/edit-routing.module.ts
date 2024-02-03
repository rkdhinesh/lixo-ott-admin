import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditVenueComponent } from './edit-venue.component';
export const routes: Routes = [
    { path: '', component: EditVenueComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EditVenueRoutingModule { }
