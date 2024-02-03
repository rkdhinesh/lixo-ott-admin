import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SeatLayoutComponent } from './seat-layout.component';
export const routes: Routes = [
    { path: '', component: SeatLayoutComponent},

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class SeatLayoutRoutingModule { }
