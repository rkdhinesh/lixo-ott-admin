import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCineastRolesComponent } from './edit-cineast-roles.component';

export const routes: Routes = [
    { path: '', component: EditCineastRolesComponent },

];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EditCineastRolesRoutingModule { }
