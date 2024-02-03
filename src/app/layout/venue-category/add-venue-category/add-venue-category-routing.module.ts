import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddVenueCategoryComponent } from './add-venue-category.component';


export const routes: Routes = [
  { path: '', component: AddVenueCategoryComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AddVenueCategoryRoutingModule { }
