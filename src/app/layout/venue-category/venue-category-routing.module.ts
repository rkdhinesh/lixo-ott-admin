import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VenueCategoryComponent } from './venue-category.component';
import { EditVenueCategoryComponent } from './edit-venue-category/edit-venue-category.component';
import { ViewVenueCategoryComponent } from './view-venue-category/view-venue-category.component';

export const routes: Routes = [
  { path: '', component: VenueCategoryComponent},
  { path: 'edit-venue-category', component: EditVenueCategoryComponent},
  { path: 'view-venue-category', component: ViewVenueCategoryComponent}
];

@NgModule({
imports: [
  RouterModule.forChild(routes)
],
exports: [
  RouterModule
]
})
export class VenueCategoryRoutingModule { }
