import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditScreenComponent } from './edit-screen.component';
export const routes: Routes = [
    { path: '', component: EditScreenComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EditScreenRoutingModule { }
