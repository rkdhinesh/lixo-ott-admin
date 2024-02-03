import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditCityComponent } from './edit-city.component';
export const routes: Routes = [{ path: '', component: EditCityComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EditCityRoutingModule { }
