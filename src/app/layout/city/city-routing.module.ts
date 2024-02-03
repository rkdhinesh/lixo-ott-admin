import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CityComponent } from './city.component';
import { AddCityComponent } from './add-city/add-city.component';
import { EditCityComponent } from './edit-city/edit-city.component';
import { ViewCityComponent } from './view-city/view-city.component';


export const routes: Routes = [
  { path: '', component: CityComponent},
  { path: 'add-city', component: AddCityComponent},
  { path: 'edit-city', component: EditCityComponent},
  { path: 'view-city', component: ViewCityComponent}
  
];

@NgModule({
imports: [
  RouterModule.forChild(routes)
],
exports: [
  RouterModule
]
})
export class CityRoutingModule { }
