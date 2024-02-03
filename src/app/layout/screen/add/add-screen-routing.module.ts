import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddScreenComponent } from './add-screen.component';
export const routes: Routes = [
    { path: '', component: AddScreenComponent},

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AddScreenRoutingModule { }
