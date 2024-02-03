import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddCineastRolesComponent } from "./add-cineast-roles.component";

export const routes: Routes = [{ path: "", component: AddCineastRolesComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddCineastRolesRoutingModule { }