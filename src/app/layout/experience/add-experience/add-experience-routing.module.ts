import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddExperienceComponent } from './add-experience.component';

const routes: Routes = [
  { path: '', component: AddExperienceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddExperienceRoutingModule { }
