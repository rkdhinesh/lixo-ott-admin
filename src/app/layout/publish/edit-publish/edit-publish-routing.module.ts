import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditPublishComponent } from './edit-publish.component';

const routes: Routes = [
  { path: '', component: EditPublishComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditPublishRoutingModule { }
