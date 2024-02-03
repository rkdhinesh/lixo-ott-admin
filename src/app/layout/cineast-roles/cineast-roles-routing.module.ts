import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CineastRolesComponent } from './cineast-roles.component';
import { EditCineastRolesComponent } from './edit-cineast-roles/edit-cineast-roles.component';

export const routes: Routes = [
    { path: '', component: CineastRolesComponent },
    { path: 'edit-cineast-roles', component: EditCineastRolesComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CineastRolesRoutingModule { }
