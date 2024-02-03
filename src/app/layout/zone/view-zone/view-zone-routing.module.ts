import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewZoneComponent } from './view-zone.component';
const routes: Routes = [
  { path: '', component: ViewZoneComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewZoneRoutingModule { }
