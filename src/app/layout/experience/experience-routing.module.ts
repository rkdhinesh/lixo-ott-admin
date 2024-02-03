import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperienceComponent } from './experience.component';
import { EditExperienceComponent } from './edit-experience/edit-experience.component';

const routes: Routes = [
  { path: '', component: ExperienceComponent},
  { path: 'edit-experience', component: EditExperienceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExperienceRoutingModule { }
