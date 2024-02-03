import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ZoneComponent } from './zone.component';
import { EditZoneComponent } from './edit-zone/edit-zone.component';
import { ViewZoneComponent } from './view-zone/view-zone.component';

export const routes: Routes = [
  { path: '', component: ZoneComponent},
  { path: 'edit-zone', component: EditZoneComponent},
  { path: 'view-zone', component: ViewZoneComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ZoneRoutingModule { }
