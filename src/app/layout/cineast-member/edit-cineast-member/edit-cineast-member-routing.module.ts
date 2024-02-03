import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditCineastMemberComponent } from './edit-cineast-member.component';

export const routes: Routes = [
    { path: '', component: EditCineastMemberComponent },

];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EditCineastMemberRoutingModule { }
