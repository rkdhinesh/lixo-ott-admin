import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LayoutComponent } from "./layout.component";

const routes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "dashboard",
        loadChildren: "./dashboard/dashboard.module#DashboardModule"
      },
      {
        path: "bs-element",
        loadChildren: "./bs-element/bs-element.module#BsElementModule"
      },
      {
        path: "blank-page",
        loadChildren: "./blank-page/blank-page.module#BlankPageModule"
      },

      { path: "zone", loadChildren: "./zone/zone.module#ZoneModule" },
      {
        path: "add-zone",
        loadChildren: "./zone/add-zone/add-zone.module#AddZoneModule"
      },
      {
        path: "edit-zone",
        loadChildren: "./zone/edit-zone/edit-zone.module#EditZoneModule"
      },
      {
        path: "view-zone",
        loadChildren: "./zone/view-zone/view-zone.module#ViewZoneModule"
      },

      {
        path: "locality",
        loadChildren: "./locality/locality.module#LocalityModule"
      },
      {
        path: "add-locality",
        loadChildren:
          "./locality/add-locality/add-locality.module#AddLocalityModule"
      },
      {
        path: "edit-locality",
        loadChildren:
          "./locality/edit-locality/edit-locality.module#EditLocalityModule"
      },
      {
        path: "view-locality",
        loadChildren:
          "./locality/view-locality/view-locality.module#ViewLocalityModule"
      },

      {
        path: "city",
        loadChildren: "./city/city.module#CityModule"
      },

      {
        path: "add-city",
        loadChildren:
          "./city/add-city/add-city.module#AddCityModule"
      },

      {
        path: "edit-city",
        loadChildren:
          "./city/edit-city/edit-city.module#EditCityModule"
      },

      {
        path: "view-city",
        loadChildren:
          "./city/view-city/view-city.module#ViewCityModule"
      },

      {
        path: "venue-category",
        loadChildren:
          "./venue-category/venue-category.module#VenueCategoryModule"
      },
      {
        path: "add-venue-category",
        loadChildren:
          "./venue-category/add-venue-category/add-venue-category.module#AddVenueCategoryModule"
      },
      {
        path: "edit-venue-category",
        loadChildren:
          "./venue-category/edit-venue-category/edit-venue-category.module#EditVenueCategoryModule"
      },
      {
        path: "view-venue-category",
        loadChildren:
          "./venue-category/view-venue-category/view-venue-category.module#ViewVenueCategoryModule"
      },

      { path: "movie", loadChildren: "./movie/movie.module#MovieModule" },

      {
        path: "cineast-roles",
        loadChildren: "./cineast-roles/cineast-roles.module#CineastRolesModule"
      },

      {
        path: "add-cineast-roles",
        loadChildren:
          "./cineast-roles/add-cineast-roles/add-cineast-roles.module#AddCineastRolesModule"
      },

      {
        path: "edit-cineast-roles",
        loadChildren:
          "./cineast-roles/edit-cineast-roles/edit-cineast-roles.module#EditCineastRolesModule"
      },

      {
        path: "cineast-member",
        loadChildren:
          "./cineast-member/cineast-member.module#CineastMemberModule"
      },

      {
        path: "add-cineast-member",
        loadChildren:
          "./cineast-member/add-cineast-member/add-cineast-member.module#AddCineastMemberModule"
      },

      {
        path: "edit-cineast-member",
        loadChildren:
          "./cineast-member/edit-cineast-member/edit-cineast-member.module#EditCineastMemberModule"
      },

      {
        path: "movie-mapping",
        loadChildren: "./movie-mapping/movie-mapping.module#MovieMappingModule"
      },

      {
        path: "add-movie-mapping",
        loadChildren:
          "./movie-mapping/add-movie-mapping/add-movie-mapping.module#AddMovieMappingModule"
      },

      {
        path: "add-movie",
        loadChildren: "./movie/add-movie/add-movie.module#AddMovieModule"
      },
      {
        path: "movie-detail",
        loadChildren: "./movie/movie-detail/movie-detail.module#MovieDetailModule"
      },
      {
        path: "add-movie-detail",
        loadChildren: "./movie/add-movie-detail/add-movie-detail.module#AddMovieDetailModule"
      },
      {
        path: "view-movie-detail",
        loadChildren: "./movie/view-movie-detail/view-movie-detail.module#ViewMovieDetailModule"
      },
      {
        path: "edit-movie-detail",
        loadChildren: "./movie/edit-movie-detail/edit-movie-detail.module#EditMovieDetailModule"
      },
      {
        path: "edit-movie",
        loadChildren: "./movie/edit-movie/edit-movie.module#EditMovieModule"
      },
      {
        path: "view-movie",
        loadChildren: "./movie/view-movie/view-movie.module#ViewMovieModule"
      },

      { path: "genre", loadChildren: "./genre/genre.module#GenreModule" },
      {
        path: "add-genre",
        loadChildren: "./genre/add-genre/add-genre.module#AddGenreModule"
      },
      {
        path: "edit-genre",
        loadChildren: "./genre/edit-genre/edit-genre.module#EditGenreModule"
      },
      {
        path: "view-genre",
        loadChildren: "./genre/view-genre/view-genre.module#ViewGenreModule"
      },

      {
        path: "company",
        loadChildren: "./company/company-page.module#CompanyPageModule"
      },
      {
        path: "edit-company",
        loadChildren: "./company/edit/edit-company.module#EditCompanyModule"
      },
      {
        path: "add-company",
        loadChildren: "./company/add/add-company.module#AddCompanyModule"
      },
      {
        path: "view-company",
        loadChildren:
          "./company/view-company/view-company.module#ViewCompanyModule"
      },

      {
        path: "experience",
        loadChildren: "./experience/experience.module#ExperienceModule"
      },
      {
        path: "add-experience",
        loadChildren:
          "./experience/add-experience/add-experience.module#AddExperienceModule"
      },
      {
        path: "edit-experience",
        loadChildren:
          "./experience/edit-experience/edit-experience.module#EditExperienceModule"
      },

      { path: "venue", loadChildren: "./venue/venue.module#VenueModule" },
      {
        path: "add-venue",
        loadChildren: "./venue/add/add-venue.module#AddVenueModule"
      },
      {
        path: "edit-venue",
        loadChildren: "./venue/edit/edit-venue.module#EditVenueModule"
      },
      {
        path: "view-venue",
        loadChildren: "./venue/view/view-venue.module#ViewVenueModule"
      },
      { path: "review", loadChildren: "./review/review.module#ReviewModule" },
      {
        path: "add-review",
        loadChildren: "./review/add-review/add-review.module#AddReviewModule"
      },
      {
        path: "edit-review",
        loadChildren: "./review/edit-review/edit-review.module#EditReviewModule"
      },

      { path: "screen", loadChildren: "./screen/screen.module#ScreenModule" },
      {
        path: "add-screen",
        loadChildren: "./screen/add/add-screen.module#AddScreenModule"
      },
      {
        path: "edit-screen",
        loadChildren: "./screen/edit/edit-screen.module#EditScreenModule"
      },
      {
        path: "seat-layout",
        loadChildren: "./screen/seat-layout/seat-layout.module#SeatLayoutModule"
      },

      {
        path: "reset-password",
        loadChildren:
          "./reset-password/reset-password.module#ResetPasswordModule"
      },
      {
        path: "user-role",
        loadChildren: "./user-role/user-role.module#UserRoleModule"
      },
      {
        path: "module-operations",
        loadChildren:
          "./user-role/module-operations/module-operations.module#ModuleOperationsModule"
      },
      {
        path: "add-module-operations",
        loadChildren:
          "./user-role/module-operations/add/add-module-operations.module#AddModuleOperationsModule"
      },
      {
        path: "edit-module-operations",
        loadChildren:
          "./user-role/module-operations/edit/edit-module-operations.module#EditModuleOperationsModule"
      },
      {
        path: "add-user",
        loadChildren: "./user-role/add-user/add-user.module#AddUserModule"
      },
      {
        path: "edit-user",
        loadChildren: "./user-role/edit-user/edit-user.module#EditUserModule"
      },
      {
        path: "roles",
        loadChildren: "./user-role/roles/roles.module#RolesModule"
      },
      {
        path: "add-role",
        loadChildren: "./user-role/roles/add/add-role.module#AddRoleModule"
      },
      {
        path: "edit-role",
        loadChildren: "./user-role/roles/edit/edit-role.module#EditRoleModule"
      },
      {
        path: "new-role",
        loadChildren: "./user-role/roles/new-role/new-role.module#NewRoleModule"
      },
      {
        path: "custom-fields",
        loadChildren:
          "./user-role/custom-fields/custom-fields.module#CustomFieldsModule"
      },

      {
        path: "add-publish",
        loadChildren:
          "./publish/add-publish/add-publish.module#AddPublishModule"
      },
      {
        path: "edit-publish",
        loadChildren:
          "./publish/edit-publish/edit-publish.module#EditPublishModule"
      },
      {
        path: "view-publish",
        loadChildren:
          "./publish/view-publish/view-publish.module#ViewPublishModule"
      },

      { path: "fare", loadChildren: "./fare/fare.module#FareModule" },
      {
        path: "add-fare",
        loadChildren: "./fare/add-fare/add-fare.module#AddFareModule"
      },
      {
        path: "edit-fare",
        loadChildren: "./fare/edit-fare/edit-fare.module#EditFareModule"
      },
      {
        path: "view-fare",
        loadChildren: "./fare/view-fare/view-fare.module#ViewFareModule"
      },

      { path: "charge", loadChildren: "./charge/charge.module#ChargeModule" },
      {
        path: "add-charge",
        loadChildren: "./charge/add-charge/add-charge.module#AddChargeModule"
      },
      {
        path: "edit-charge",
        loadChildren: "./charge/edit-charge/edit-charge.module#EditChargeModule"
      },
      {
        path: "view-charge",
        loadChildren: "./charge/view-charge/view-charge.module#ViewChargeModule"
      },

      { path: "tax", loadChildren: "./tax/tax.module#TaxModule" },
      {
        path: "add-tax",
        loadChildren: "./tax/add-tax/add-tax.module#AddTaxModule"
      },
      {
        path: "edit-tax",
        loadChildren: "./tax/edit-tax/edit-tax.module#EditTaxModule"
      },
      {
        path: "view-tax",
        loadChildren: "./tax/view-tax/view-tax.module#ViewTaxModule"
      },
      {
        path: "box-office-users",
        loadChildren: "./box-office-user-role/box-office-user-role.module#BoxOfficeUserRoleModule"
      },
      {
        path: "add-user-box-office",
        loadChildren: "./box-office-user-role/add-user-role/add-user-role.module#AddUserRoleModule"
      },
      {
        path: "edit-user-box-office",
        loadChildren: "./box-office-user-role/edit-user-role/edit-user-role.module#EditUserRoleModule"
      },
      {
        path: "authorization",
        loadChildren: "./authorization/authorization.module#AuthorizationModule"
      },
      {
        path: "add-authorization",
        loadChildren: "./authorization/add-authorization/add-authorization.module#AddAuthorizationModule"
      },
      {
        path: "edit-authorization",
        loadChildren: "./authorization/edit-authorization/edit-authorization.module#EditAuthorizationModule"
      },
      {
        path: "role-user",
        loadChildren: "./role-user/role-user.module#RoleUserModule"
      },
      {
        path: "add-role-user",
        loadChildren: "./role-user/add-role-user/add-role-user.module#AddRoleUserModule"
      },
      {
        path: "edit-role-user",
        loadChildren: "./role-user/edit-role-user/edit-role-user.module#EditRoleUserModule"
      },
      {
        path: "role-authorization",
        loadChildren: "./role-authorization/role-authorization.module#RoleAuthorizationModule"
      },
      {
        path: "add-role-authorization",
        loadChildren: "./role-authorization/add-role-authorization/add-role-authorization.module#AddRoleAuthorizationModule"
      },
      {
        path: "edit-role-authorization",
        loadChildren: "./role-authorization/edit-role-authorization/edit-role-authorization.module#EditRoleAuthorizationModule"
      },
      {
        path: "view-role-authorization",
        loadChildren: "./role-authorization/view-role-authorization/view-role-authorization.module#ViewRoleAuthorizationModule"
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
