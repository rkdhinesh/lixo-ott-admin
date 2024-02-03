import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCineastMemberComponent } from './add-cineast-member.component';
export const routes: Routes = [{ path: '', component: AddCineastMemberComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AddCineastMemberRoutingModule { }
