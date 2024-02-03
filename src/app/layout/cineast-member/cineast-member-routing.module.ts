import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CineastMemberComponent } from './cineast-member.component';
import { EditCineastMemberComponent } from './edit-cineast-member/edit-cineast-member.component';

export const routes: Routes = [
    { path: '', component: CineastMemberComponent },
    { path: 'edit-cineast-member', component: EditCineastMemberComponent },
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CineastMemberRoutingModule { }
