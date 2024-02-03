import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FareComponent } from './fare.component';
import { EditFareComponent } from './edit-fare/edit-fare.component';
import { ViewFareComponent } from './view-fare/view-fare.component';


export const routes: Routes = [
  { path: '', component: FareComponent},
  { path: 'edit-fare', component: EditFareComponent},
  { path: 'view-fare', component: ViewFareComponent},

];

@NgModule({
imports: [
  RouterModule.forChild(routes)
],
exports: [
  RouterModule
]
})
export class FareRoutingModule { }
