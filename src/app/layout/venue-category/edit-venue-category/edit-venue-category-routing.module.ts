import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditVenueCategoryComponent } from './edit-venue-category.component';


export const routes: Routes = [
  { path: '', component: EditVenueCategoryComponent },
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EditVenueCategoryRoutingModule { }
