import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditScreenComponent } from './edit/edit-screen.component';
import { ScreenComponent } from './screen.component';
import { SeatLayoutComponent } from './seat-layout/seat-layout.component';
export const routes: Routes = [
    { path: '', component: ScreenComponent},
    { path: 'edit-screen', component: EditScreenComponent},
    { path: 'view-seat-layout', component: SeatLayoutComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class ScreenRoutingModule { }
