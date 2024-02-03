import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddMovieMappingComponent } from './add-movie-mapping.component';

export const routes: Routes = [{ path: "", component: AddMovieMappingComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddMovieMappingRoutingModule { }