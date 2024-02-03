import { NgModule } from '@angular/core';
import { AddZoneComponent } from './add-zone.component';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  { path: '', component: AddZoneComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AddZoneRoutingModule { }
