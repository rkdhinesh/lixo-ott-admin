import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditExperienceComponent } from './edit-experience.component';

const routes: Routes = [
  { path: '', component: EditExperienceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditExperienceRoutingModule { }
