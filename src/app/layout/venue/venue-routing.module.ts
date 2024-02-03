import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditVenueComponent } from './edit/edit-venue.component';
import { VenueComponent } from './venue.component';
import { ViewVenueComponent } from './view/view-venue.component';
export const routes: Routes = [
    { path: '', component: VenueComponent},
    { path: 'edit-venue', component: EditVenueComponent},
    { path: 'view-venue', component: ViewVenueComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class VenueRoutingModule { }
