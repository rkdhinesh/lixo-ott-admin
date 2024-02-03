import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewCityComponent } from './view-city.component';

export const routes: Routes = [{ path: '', component: ViewCityComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ViewCityRoutingModule { }
