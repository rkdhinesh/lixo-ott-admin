import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCityComponent } from './add-city.component';
;




export const routes: Routes = [{ path: '', component: AddCityComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddCityRoutingModule { }
