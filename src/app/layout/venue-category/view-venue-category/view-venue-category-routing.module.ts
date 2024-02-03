import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewVenueCategoryComponent } from './view-venue-category.component';

const routes: Routes = [
  { path: '', component: ViewVenueCategoryComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewVenueCategoryRoutingModule { }
