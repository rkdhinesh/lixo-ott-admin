import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ApprovePublishComponent } from './approve-publish.component';

const routes: Routes = [
  {path: '', component: ApprovePublishComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApprovePublishRoutingModule { }
