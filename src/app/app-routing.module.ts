import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared';
import { ResetPasswordComponent } from './layout/reset-password/reset-password.component';


const routes: Routes = [
    {
        path: '',
        loadChildren: './login/login.module#LoginModule', canActivate: [AuthGuard]
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent
      },
    { path: 'layout', loadChildren: './layout/layout.module#LayoutModule', canActivate: [AuthGuard], canActivateChild: [AuthGuard] },
    { path: 'signup', loadChildren: './signup/signup.module#SignupModule' },
    { path: 'reset-password', loadChildren: './layout/reset-password/reset-password.module#ResetPasswordModule' },
    { path: 'not-found', loadChildren: './not-found/not-found.module#NotFoundModule' },
    { path: 'geo-location', loadChildren: './geolocation/geolocation.module#GeolocationModule' },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
