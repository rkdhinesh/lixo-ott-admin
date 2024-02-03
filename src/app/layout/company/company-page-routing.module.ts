import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditVenueComponent } from '../venue/edit/edit-venue.component';
import { CompanyPageComponent } from './company-page.component';
import { EditCompanyComponent } from './edit/edit-company.component';
import { ViewCompanyComponent } from './view-company/view-company.component';
export const routes: Routes = [
  { path: '', component: CompanyPageComponent },
  { path: 'edit-company', component: EditCompanyComponent },
  { path: 'view-company', component: ViewCompanyComponent },
  { path: 'venue/edit-venue', component: EditVenueComponent },

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CompanyRoutingModule { }
