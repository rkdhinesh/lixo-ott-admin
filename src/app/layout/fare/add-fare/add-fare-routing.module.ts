import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddFareComponent } from './add-fare.component';


export const routes: Routes = [
  { path: '', component: AddFareComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AddFareRoutingModule { }
