import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MovieMappingComponent } from './movie-mapping.component';

export const routes: Routes = [{ path: '', component: MovieMappingComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MovieMappingRoutingModule { }
