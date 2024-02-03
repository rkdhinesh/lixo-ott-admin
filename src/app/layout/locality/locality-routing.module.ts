import { NgModule } from '@angular/core';
import { LocalityComponent } from './locality.component';
import { EditLocalityComponent } from './edit-locality/edit-locality.component';
import { Routes, RouterModule } from '@angular/router';
import { ViewLocalityComponent } from './view-locality/view-locality.component';

export const routes: Routes = [
  { path: '', component: LocalityComponent},
  { path: 'edit-locality', component: EditLocalityComponent},
  { path: 'view-locality', component: ViewLocalityComponent },
];

@NgModule({
imports: [
  RouterModule.forChild(routes)
],
exports: [
  RouterModule
]
})
export class LocalityRoutingModule { }
