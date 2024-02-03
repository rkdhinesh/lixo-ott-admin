import { NgModule } from '@angular/core';
import { EditZoneComponent } from './edit-zone.component';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', component: EditZoneComponent},

];

@NgModule({
imports: [
  RouterModule.forChild(routes)
],
exports: [
  RouterModule
]
})
export class EditZoneRoutingModule { }
