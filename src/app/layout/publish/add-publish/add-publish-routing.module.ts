import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPublishComponent } from './add-publish.component';

const routes: Routes = [ 
  {path: '', component: AddPublishComponent},
 // {path: 'view-publish', component: ViewPublishComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPublishRoutingModule { }
