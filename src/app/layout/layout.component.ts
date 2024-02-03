import { Component, ViewChild, OnInit, HostListener } from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { MatSidenav } from "@angular/material/sidenav";
import { Header } from "../shared/services/header";
import { RestService } from "../api.service";
import { UserModule } from "../shared/model/user-module";
import { Operation } from "../shared/model/operation";
import { SideNavService } from "../shared/services/side-nav.service";
import { Module } from "../shared/model/module";
import { SubModule } from "../shared/model/sub-module";
import { LogService } from "../shared/services/log.service";
import { environment } from "../../environments/environment";
import { Subscription } from "rxjs";
import PerfectScrollbar from "perfect-scrollbar";
import {
  Location,
  PopStateEvent
} from "@angular/common";
import { filter } from "rxjs/operators";
import { UserAccessRequest } from "../shared/model/UserAccessRequest";
export class UserModuleRequestHeader {
  userId: string;
  system: string;
  client: string;
  header: Header;
  constructor() { }
}

@Component({
  selector: "app-layout",
  templateUrl: "./layout.component.html",
  styleUrls: ["./layout.component.scss"]
})
export class LayoutComponent implements OnInit {
  @ViewChild("sidenav") sidenav: MatSidenav;
  navMode = "side";
  moduleLists: UserModule[] = [];
  modules: Module[] = [];
  operationLists: Array<Operation> = [];
  moduleRouterLinkMap: Map<string, string> = new Map<string, string>();
  moduleOperationRouterLinkMap: Map<string, string> = new Map<string, string>();
  moduleIconNameMap: Map<string, string> = new Map<string, string>();
  public _router: Subscription;
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];

  constructor(
    public router: Router,
    private restService: RestService,
    private sideNavService: SideNavService,
    private log: LogService,
    public location: Location
  ) { }

  ngOnInit() {
    if (localStorage.getItem('isLoggedin') === undefined || localStorage.getItem('isLoggedin') === null) {
      this.router.navigate(['/']);
    }
    this.log.info(" Layout Comonent init method is called..");
    this.sideNavService.setSidenav(this.sidenav);

    this.moduleLists = [];
    this.modules = [];

    if (window.innerWidth < 768) {
      this.navMode = "over";
    }

    if (localStorage.getItem("isLoggedin")) {
      this.moduleRouterLinkMap.set("Company", "/company");
      this.moduleRouterLinkMap.set("Zone", "/zone");
      this.moduleRouterLinkMap.set("Publish", "/edit-publish");
      this.moduleRouterLinkMap.set("Locality", "/locality");
      this.moduleRouterLinkMap.set("City", "/city");
      this.moduleRouterLinkMap.set("Venue Category", "/venue-category");
      this.moduleRouterLinkMap.set("Movie", "/movie");
      // this.moduleRouterLinkMap.set("Movie Detail", "/movie-detail");
      this.moduleRouterLinkMap.set("Experience", "/review");
      this.moduleRouterLinkMap.set("Genre", "/genre");
      this.moduleRouterLinkMap.set("Venue", "/venue");
      this.moduleRouterLinkMap.set("Charge", "/charge");
      this.moduleRouterLinkMap.set("Fare", "/fare");
      this.moduleRouterLinkMap.set("Tax", "/tax");

      this.moduleRouterLinkMap.set("Users", "/user-role");
      this.moduleRouterLinkMap.set("Cineast Roles", "/cineast-roles");
      this.moduleRouterLinkMap.set("Cineast Member", "/cineast-member");
      this.moduleRouterLinkMap.set("Movie Mapping", "/movie-mapping");
      //box office
      this.moduleRouterLinkMap.set("Box Office Users", "/box-office-users");

      //Role Management 
      this.moduleRouterLinkMap.set("User", "/role-user");
      this.moduleRouterLinkMap.set("Authorization", "/authorization");
      this.moduleRouterLinkMap.set("Role", "/role-authorization");

      this.moduleIconNameMap.set("Zone Management", "location_city");
      this.moduleIconNameMap.set("Zone", "location_city");
      this.moduleIconNameMap.set("Locality", "location_on");
      this.moduleIconNameMap.set("Venue Category", "category");
      this.moduleIconNameMap.set("Company", "work");
      this.moduleIconNameMap.set("Venue", "my_location");
      this.moduleIconNameMap.set("Experience", "work");
      this.moduleIconNameMap.set("City", "location_city");

      this.moduleIconNameMap.set("Tariff", "monetization_on");
      this.moduleIconNameMap.set("Charge", "monetization_on");
      this.moduleIconNameMap.set("Fare", "attach_money");
      this.moduleIconNameMap.set("Tax", "toll");



      this.moduleIconNameMap.set("Movie Management", "movie");
      this.moduleIconNameMap.set("Movie", "local_movies");
      // this.moduleIconNameMap.set("Movie Detail", "local_movies");
      this.moduleIconNameMap.set("Publish", "publish");
      this.moduleIconNameMap.set("Review", "rate_review");
      this.moduleIconNameMap.set("Genre", "list");

      this.moduleIconNameMap.set("Cineast Management", "local_movies");
      this.moduleIconNameMap.set("Cineast Roles", "school");
      this.moduleIconNameMap.set("Cineast Member", "person");
      this.moduleIconNameMap.set("Movie Mapping", "movie");

      //box office
      this.moduleIconNameMap.set("User Management", "people");
      this.moduleIconNameMap.set("Box Office Users", "people_outline");

      //Role Management 
      this.moduleIconNameMap.set("Role Management", "people");
      this.moduleIconNameMap.set("User", "person");
      this.moduleIconNameMap.set("Authorization", "school");
      this.moduleIconNameMap.set("Role", "people_outline");

      this.moduleOperationRouterLinkMap.set("Cineast-Role-Create", "/add-cineast-roles");
      this.moduleOperationRouterLinkMap.set("Cineast-Role-Edit", "/edit-cineast-roles");
      this.moduleOperationRouterLinkMap.set("Cineast-Member-Create", "/add-cineast-member");
      this.moduleOperationRouterLinkMap.set("Cineast-Member-Edit", "/edit-cineast-member");
      this.moduleOperationRouterLinkMap.set("Movie-Mapping-Create", "/add-movie-mapping");

      this.moduleOperationRouterLinkMap.set("Box-Office-Create", "/add-user-box-office");
      this.moduleOperationRouterLinkMap.set("Box-Office-Edit", "/edit-user-box-office");
      this.moduleOperationRouterLinkMap.set("Box-Office-View", "/box-office-users");

      this.moduleOperationRouterLinkMap.set("Company-Create", "/add-company");
      this.moduleOperationRouterLinkMap.set("Company-Edit", "/edit-company");
      this.moduleOperationRouterLinkMap.set("Company-View", "/company");
      this.moduleOperationRouterLinkMap.set("Zone-Create", "/add-zone");
      this.moduleOperationRouterLinkMap.set("Zone-Edit", "/edit-zone");
      this.moduleOperationRouterLinkMap.set("Zone-View", "/zone");
      this.moduleOperationRouterLinkMap.set("Publish-Create", "/add-publish");
      this.moduleOperationRouterLinkMap.set("Publish-View", "/view-publish");

      this.moduleOperationRouterLinkMap.set("Locality-Create", "/add-locality");
      this.moduleOperationRouterLinkMap.set("Locality-Edit", "/edit-locality");
      this.moduleOperationRouterLinkMap.set("Locality-View", "/view-locality");

      this.moduleOperationRouterLinkMap.set("City-Create", "/add-city");
      this.moduleOperationRouterLinkMap.set("City-Edit", "/edit-city");
      this.moduleOperationRouterLinkMap.set("City-View", "/view-city");

      this.moduleOperationRouterLinkMap.set(
        "Venue Category-Create",
        "/add-venue-category"
      );
      this.moduleOperationRouterLinkMap.set(
        "Venue Category-Edit",
        "/edit-venue-category"
      );
      this.moduleOperationRouterLinkMap.set(
        "Venue Category-View",
        "/venue-category"
      );

      this.moduleOperationRouterLinkMap.set("Movie-Create", "/add-movie");
      this.moduleOperationRouterLinkMap.set("Movie-Edit", "/edit-movie");
      this.moduleOperationRouterLinkMap.set("Movie-View", "/movie");
      // this.moduleOperationRouterLinkMap.set("Movie-Detail-Create", "/add-movie-detail");
      // this.moduleOperationRouterLinkMap.set("Movie-Detail-Edit", "/edit-movie-detail");
      // this.moduleOperationRouterLinkMap.set("Movie-Detail-View", "/movie-detail");
      this.moduleOperationRouterLinkMap.set("Review-Create", "/add-review");
      this.moduleOperationRouterLinkMap.set("Review-Edit", "/edit-review");
      this.moduleOperationRouterLinkMap.set("Review-View", "/review");
      this.moduleOperationRouterLinkMap.set("Genre-Create", "/add-genre");
      this.moduleOperationRouterLinkMap.set("Genre-Edit", "/edit-genre");
      this.moduleOperationRouterLinkMap.set("Genre-View", "/genre");
      this.moduleOperationRouterLinkMap.set("Charge-Create", "/add-charge");
      this.moduleOperationRouterLinkMap.set("Charge-Edit", "/edit-charge");
      this.moduleOperationRouterLinkMap.set("Charge-View", "/charge");
      this.moduleOperationRouterLinkMap.set("Venue-Create", "/add-venue");
      this.moduleOperationRouterLinkMap.set("Venue-Edit", "/edit-venue");
      this.moduleOperationRouterLinkMap.set("Venue-View", "/venue");
      this.moduleOperationRouterLinkMap.set("Fare-Create", "/add-fare");
      this.moduleOperationRouterLinkMap.set("Fare-Edit", "/edit-fare");
      this.moduleOperationRouterLinkMap.set("Fare-View", "/fare");
      this.moduleOperationRouterLinkMap.set("Tax-Create", "/add-tax");
      this.moduleOperationRouterLinkMap.set("Tax-Edit", "/edit-tax");
      this.moduleOperationRouterLinkMap.set("Tax-View", "/tax");

      this.moduleOperationRouterLinkMap.set(
        "Reset-Password",
        "/reset-password"
      );
      this.moduleOperationRouterLinkMap.set("Users-View", "/user-role");
      this.moduleOperationRouterLinkMap.set(
        "Experience-Create",
        "/add-experience"
      );
      this.moduleOperationRouterLinkMap.set(
        "Experience-Edit",
        "/edit-experience"
      );


      var currentUser = JSON.parse(localStorage.getItem("currentUser"));

      let result: Array<Module> = [];
      let subModules: Array<SubModule> = [];
      let operationLists: Array<Operation> = [];
      let module = new Module();
      let subModule = new SubModule();
      let operation = new Operation();


      let userAccessRequest = <UserAccessRequest>{};
      userAccessRequest.userId = currentUser.userName;
      userAccessRequest.systemId = "moviepanda-admin"
      userAccessRequest.companyId = currentUser.companyId;

      this.restService
        .post(userAccessRequest, environment.fetchAccessForUser)
        .map((response: any) => {
          if (response) {
            console.log('Modules layout::::::::' + JSON.stringify(response));

            console.log('Modules layout::::::::' + response.authorizationAccessList.Authorization_Create);
            if (response.authorizationAccessList.Movie_List || response.authorizationAccessList.Publish_List || response.authorizationAccessList.Experience_List || response.authorizationAccessList.Genre_List) {

              module = new Module();
              subModules = [];
              module.moduleName = "Movie Management";
              module.moduleRouterLink = this.moduleRouterLinkMap.get("Movie Management");
              module.moduleIconName = this.moduleIconNameMap.get("Movie Management");
              if (response.authorizationAccessList.Experience_Delete || response.authorizationAccessList.Experience_Create || response.authorizationAccessList.Experience_Edit || response.authorizationAccessList.Experience_View) {
                //submodule - Movie Management
                // {
                subModule = new SubModule();
                subModule.subModuleName = "Experience";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Experience");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Experience");
                this.operationLists = [];

                if (response.authorizationAccessList.Experience_Create) {
                  this.addModuleOperations("Experience-Create", operationLists);
                }
                if (response.authorizationAccessList.Experience_Edit) {
                  this.addModuleOperations("Experience-Edit", operationLists);
                }
                if (response.authorizationAccessList.Experience_View) {
                  this.addModuleOperations("Experience-View", operationLists);
                }
                if (response.authorizationAccessList.Experience_Delete) {
                  this.addModuleOperations("Experience-Delete", operationLists);
                }
                subModules.push(subModule);
              }
              if (response.authorizationAccessList.Genre_Delete || response.authorizationAccessList.Genre_Create || response.authorizationAccessList.Genre_Edit || response.authorizationAccessList.Genre_View) {
                //submodule - Movie Management
                {
                  subModule = new SubModule();
                  subModule.subModuleName = "Genre";
                  subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Genre");
                  subModule.subModuleIconName = this.moduleIconNameMap.get("Genre");
                  this.operationLists = [];

                  if (response.authorizationAccessList.Genre_Create) {
                    this.addModuleOperations("Genre-Create", operationLists);
                  }
                  if (response.authorizationAccessList.Genre_Edit) {
                    this.addModuleOperations("Genre-Edit", operationLists);
                  }
                  if (response.authorizationAccessList.Genre_View) {
                    this.addModuleOperations("Genre-View", operationLists);
                  }
                  if (response.authorizationAccessList.Genre_Delete) {
                    this.addModuleOperations("Genre-Delete", operationLists);
                  }
                  subModule.operations = this.operationLists;
                  subModules.push(subModule);
                }
              }
              if (response.authorizationAccessList.Movie_Delete || response.authorizationAccessList.Movie_Create || response.authorizationAccessList.Movie_Edit || response.authorizationAccessList.Movie_View) {
                //submodule - Movie Management

                subModule = new SubModule();
                subModule.subModuleName = "Movie";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Movie");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Movie");
                this.operationLists = [];

                if (response.authorizationAccessList.Movie_Create) {
                  this.addModuleOperations("Movie-Create", operationLists);
                }
                if (response.authorizationAccessList.Movie_Edit) {
                  this.addModuleOperations("Movie-Edit", operationLists);
                }
                if (response.authorizationAccessList.Movie_View) {
                  this.addModuleOperations("Movie-View", operationLists);
                }
                if (response.authorizationAccessList.Movie_Delete) {
                  this.addModuleOperations("Movie-Delete", operationLists);
                }

                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              // if (response.authorizationAccessList.Movie_Delete || response.authorizationAccessList.Movie_Create || response.authorizationAccessList.Movie_Edit || response.authorizationAccessList.Movie_View) {
              //   //submodule - Movie Management

              //   subModule = new SubModule();
              //   subModule.subModuleName = "Movie Detail";
              //   subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Movie Detail");
              //   subModule.subModuleIconName = this.moduleIconNameMap.get("Movie Detail");
              //   this.operationLists = [];

              //   if (response.authorizationAccessList.Movie_Create) {
              //     this.addModuleOperations("Movie-Create", operationLists);
              //   }
              //   if (response.authorizationAccessList.Movie_Edit) {
              //     this.addModuleOperations("Movie-Edit", operationLists);
              //   }
              //   if (response.authorizationAccessList.Movie_View) {
              //     this.addModuleOperations("Movie-View", operationLists);
              //   }
              //   if (response.authorizationAccessList.Movie_Delete) {
              //     this.addModuleOperations("Movie-Delete", operationLists);
              //   }

              //   subModule.operations = this.operationLists;
              //   subModules.push(subModule);
              // }
              if (response.authorizationAccessList.Publish_Delete || response.authorizationAccessList.Publish_Create || response.authorizationAccessList.Publish_Edit || response.authorizationAccessList.Publish_View) {

                subModule = new SubModule();
                subModule.subModuleName = "Publish";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Publish");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Publish");
                this.operationLists = [];

                if (response.authorizationAccessList.Publish_Create) {
                  this.addModuleOperations("Publish-Create", operationLists);
                }

                if (response.authorizationAccessList.Publish_View) {
                  this.addModuleOperations("Publish-View", operationLists);
                }
                subModule.operations = this.operationLists;
                subModules.push(subModule);

              }

              module.subModules = subModules;
              module.subModules.sort((a: SubModule, b: SubModule) => {
                return a.subModuleName > b.subModuleName ? 1 : -1;
              });

              if (subModules.length > 1) {
                module.subNavHide = false;
              }
              result.push(module);
            }
            if (response.authorizationAccessList.Fare_List || response.authorizationAccessList.Charge_List || response.authorizationAccessList.Tax_List) {
              //Tariff
              module = new Module();
              subModules = [];
              module.moduleName = "Tariff";
              module.moduleRouterLink = this.moduleRouterLinkMap.get("Tariff");
              module.moduleIconName = this.moduleIconNameMap.get("Tariff");

              //submodule - Tariff
              if (response.authorizationAccessList.Charge_Delete || response.authorizationAccessList.Charge_Create || response.authorizationAccessList.Charge_Edit || response.authorizationAccessList.Charge_View) {
                subModule = new SubModule();
                subModule.subModuleName = "Charge";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Charge");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Charge");
                this.operationLists = [];
                if (response.authorizationAccessList.Charge_Create) {
                  this.addModuleOperations("Charge-Create", operationLists);
                }
                if (response.authorizationAccessList.Charge_Edit) {
                  this.addModuleOperations("Charge-Edit", operationLists);
                }
                if (response.authorizationAccessList.Charge_View) {
                  this.addModuleOperations("Charge-View", operationLists);
                }
                if (response.authorizationAccessList.Charge_Delete) {
                  this.addModuleOperations("Charge-Delete", operationLists);
                }

                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              if (response.authorizationAccessList.Fare_Delete || response.authorizationAccessList.Fare_Create || response.authorizationAccessList.Fare_Edit || response.authorizationAccessList.Fare_View) {
                subModule = new SubModule();
                subModule.subModuleName = "Fare";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Fare");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Fare");
                this.operationLists = [];
                if (response.authorizationAccessList.Fare_Create) {
                  this.addModuleOperations("Fare-Create", operationLists);
                }
                if (response.authorizationAccessList.Fare_Edit) {
                  this.addModuleOperations("Fare-Edit", operationLists);
                }
                if (response.authorizationAccessList.Fare_View) {
                  this.addModuleOperations("Fare-View", operationLists);
                }
                if (response.authorizationAccessList.Fare_Delete) {
                  this.addModuleOperations("Fare-Delete", operationLists);
                }

                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              if (response.authorizationAccessList.Tax_Delete || response.authorizationAccessList.Tax_Create || response.authorizationAccessList.Tax_Edit || response.authorizationAccessList.Tax_View) {
                subModule = new SubModule();
                subModule.subModuleName = "Tax";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Tax");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Tax");
                this.operationLists = [];
                if (response.authorizationAccessList.Tax_Create) {
                  this.addModuleOperations("Tax-Create", operationLists);
                }
                if (response.authorizationAccessList.Tax_Edit) {
                  this.addModuleOperations("Tax-Edit", operationLists);
                }
                if (response.authorizationAccessList.Tax_View) {
                  this.addModuleOperations("Tax-View", operationLists);
                }
                if (response.authorizationAccessList.Tax_Delete) {
                  this.addModuleOperations("Tax-Delete", operationLists);
                }

                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              module.subModules = subModules;
              module.subModules.sort((a: SubModule, b: SubModule) => {
                return a.subModuleName > b.subModuleName ? 1 : -1;
              });

              if (subModules.length > 1) {
                module.subNavHide = false;
              }
              result.push(module);




            }
            if (response.authorizationAccessList.Cineast_Member_List || response.authorizationAccessList.Cineast_Roles_List || response.authorizationAccessList.Movie_Mapping_List) {
              //Cineast Management
              module = new Module();
              subModules = [];
              module.moduleName = "Cineast Management";
              module.moduleRouterLink = this.moduleRouterLinkMap.get("Cineast Management");
              module.moduleIconName = this.moduleIconNameMap.get("Cineast Management");

              //submodule - Cineast Management
              if (response.authorizationAccessList.Cineast_Member_Delete || response.authorizationAccessList.Cineast_Member_Create || response.authorizationAccessList.Cineast_Member_Edit || response.authorizationAccessList.Cineast_Member_View) {
                subModule = new SubModule();
                subModule.subModuleName = "Cineast Member";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Cineast Member");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Cineast Member");

                this.operationLists = [];
                if (response.authorizationAccessList.Cineast_Member_Create) {
                  this.addModuleOperations("Cineast-Member-Create", operationLists);
                }
                if (response.authorizationAccessList.Cineast_Member_Edit) {
                  this.addModuleOperations("Cineast-Member-Edit", operationLists);
                }
                if (response.authorizationAccessList.Cineast_Member_View) {
                  this.addModuleOperations("Cineast-Member-View", operationLists);
                }
                if (response.authorizationAccessList.Cineast_Member_Delete) {
                  this.addModuleOperations("Cineast-Member-Delete", operationLists);
                }

                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              if (response.authorizationAccessList.Cineast_Roles_Delete || response.authorizationAccessList.Cineast_Roles_Create || response.authorizationAccessList.Cineast_Roles_Edit || response.authorizationAccessList.Cineast_Roles_View) {
                subModule = new SubModule();
                subModule.subModuleName = "Cineast Roles";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Cineast Roles");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Cineast Roles");
                this.operationLists = [];
                if (response.authorizationAccessList.Cineast_Roles_Create) {
                  this.addModuleOperations("Cineast-Role-Create", operationLists);
                }
                if (response.authorizationAccessList.Cineast_Roles_Edit) {
                  this.addModuleOperations("Cineast-Role-Edit", operationLists);
                }
                if (response.authorizationAccessList.Cineast_Roles_View) {
                  this.addModuleOperations("Cineast-Role-View", operationLists);
                }
                if (response.authorizationAccessList.Cineast_Roles_Delete) {
                  this.addModuleOperations("Cineast-Role-Delete", operationLists);
                }

                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              if (response.authorizationAccessList.Movie_Mapping_Delete || response.authorizationAccessList.Movie_Mapping_Create || response.authorizationAccessList.Movie_Mapping_Edit || response.authorizationAccessList.Movie_Mapping_View) {
                subModule = new SubModule();
                subModule.subModuleName = "Movie Mapping";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Movie Mapping");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Movie Mapping");
                this.operationLists = [];
                if (response.authorizationAccessList.Movie_Mapping_Create) {
                  this.addModuleOperations("Movie-Mapping-Create", operationLists);
                }
                if (response.authorizationAccessList.Movie_Mapping_Create) {
                  this.addModuleOperations("Movie-Mapping-Delete", operationLists);
                }

                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              module.subModules = subModules;
              module.subModules.sort((a: SubModule, b: SubModule) => {
                return a.subModuleName > b.subModuleName ? 1 : -1;
              });

              if (subModules.length > 1) {
                module.subNavHide = false;
              }
              result.push(module);

            }
            if (response.authorizationAccessList.Box_Office_List || response.authorizationAccessList.User_Role_List) {
              //Box Office

              module = new Module();
              subModules = [];
              module.moduleName = "User Management";
              module.moduleRouterLink = this.moduleRouterLinkMap.get("User Management");
              module.moduleIconName = this.moduleIconNameMap.get("User Management");
              if (response.authorizationAccessList.Box_Office_Create || response.authorizationAccessList.Box_Office_Edit || response.authorizationAccessList.Box_Office_View || response.authorizationAccessList.Box_Office_Delete) {
                //submodule - Box Office
                subModule = new SubModule();
                subModule.subModuleName = "Box Office Users";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Box Office Users");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Box Office Users");
                this.operationLists = [];
                if (response.authorizationAccessList.Box_Office_Create) {
                  this.addModuleOperations("Box-Office-Create", operationLists);
                }

                if (response.authorizationAccessList.Box_Office_Edit) {
                  this.addModuleOperations("Box-Office-Edit", operationLists);
                }

                if (response.authorizationAccessList.Box_Office_View) {
                  this.addModuleOperations("Box-Office-View", operationLists);
                }
                if (response.authorizationAccessList.Box_Office_Delete) {
                  this.addModuleOperations("Box-Office-Delete", operationLists);
                }


                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              if (response.authorizationAccessList.User_Role_Create || response.authorizationAccessList.User_Role_Edit || response.authorizationAccessList.User_Role_View || response.authorizationAccessList.User_Role_Delete) {
                subModule = new SubModule();
                subModule.subModuleName = "Admin User";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("User");
                subModule.subModuleIconName = this.moduleIconNameMap.get("User");
                this.operationLists = [];
                if (response.authorizationAccessList.User_Role_Create) {
                  this.addModuleOperations("User-Role-Create", operationLists);
                }
                if (response.authorizationAccessList.User_Role_Edit) {
                  this.addModuleOperations("User-Role-Edit", operationLists);
                }
                if (response.authorizationAccessList.User_Role_View) {
                  this.addModuleOperations("User-Role-View", operationLists);
                }
                if (response.authorizationAccessList.User_Role_Delete) {
                  this.addModuleOperations("User-Role-Delete", operationLists);
                }

                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              module.subModules = subModules;
              module.subModules.sort((a: SubModule, b: SubModule) => {
                return a.subModuleName > b.subModuleName ? 1 : -1;
              });

              if (subModules.length > 1) {
                module.subNavHide = false;
              }

              result.push(module);

            }
            if (response.authorizationAccessList.Role_List || response.authorizationAccessList.Authorization_List) {
              //Role Management
              module = new Module();
              subModules = [];
              module.moduleName = "Role Management";
              module.moduleRouterLink = this.moduleRouterLinkMap.get("Role Management");
              module.moduleIconName = this.moduleIconNameMap.get("Role Management");


              if (response.authorizationAccessList.Authorization_Delete || response.authorizationAccessList.Authorization_Create || response.authorizationAccessList.Authorization_Edit || response.authorizationAccessList.Authorization_View) {
                subModule = new SubModule();
                subModule.subModuleName = "Authorization";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Authorization");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Authorization");
                this.operationLists = [];
                if (response.authorizationAccessList.Authorization_Create) {
                  this.addModuleOperations("Authorization-Create", operationLists);
                }
                if (response.authorizationAccessList.Authorization_Edit) {
                  this.addModuleOperations("Authorization-Edit", operationLists);
                }
                if (response.authorizationAccessList.Authorization_View) {
                  this.addModuleOperations("Authorization-View", operationLists);
                }
                if (response.authorizationAccessList.Authorization_Delete) {
                  this.addModuleOperations("Authorization-Delete", operationLists);
                }
                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              if (response.authorizationAccessList.Role_Delete || response.authorizationAccessList.Role_Create || response.authorizationAccessList.Role_Edit || response.authorizationAccessList.Role_View) {
                subModule = new SubModule();
                subModule.subModuleName = "Role";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Role");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Role");
                this.operationLists = [];
                if (response.authorizationAccessList.Role_Create) {
                  this.addModuleOperations("Role-Create", operationLists);
                }
                if (response.authorizationAccessList.Role_Edit) {
                  this.addModuleOperations("Role-Edit", operationLists);
                }
                if (response.authorizationAccessList.Role_View) {
                  this.addModuleOperations("Role-View", operationLists);
                }
                if (response.authorizationAccessList.Role_Delete) {
                  this.addModuleOperations("Role-Delete", operationLists);
                }
                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }


              module.subModules = subModules;
              module.subModules.sort((a: SubModule, b: SubModule) => {
                return a.subModuleName > b.subModuleName ? 1 : -1;
              });

              if (subModules.length > 1) {
                module.subNavHide = false;
              }
              result.push(module);
            }
            if (response.authorizationAccessList.Zone_List || response.authorizationAccessList.Venue_List || response.authorizationAccessList.City_List || response.authorizationAccessList.Locality_List || response.authorizationAccessList.Venue_Category_List) {

              //Zone Management
              module = new Module();
              subModules = [];
              module.moduleName = "Zone Management";
              module.moduleRouterLink = this.moduleRouterLinkMap.get("Zone Management");
              module.moduleIconName = this.moduleIconNameMap.get("Zone Management");

              //submodule - Zone Management
              if (response.authorizationAccessList.City_Delete || response.authorizationAccessList.City_Create || response.authorizationAccessList.City_Edit || response.authorizationAccessList.City_View) {
                subModule = new SubModule();
                subModule.subModuleName = "City";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("City");
                subModule.subModuleIconName = this.moduleIconNameMap.get("City");
                this.operationLists = [];
                if (response.authorizationAccessList.City_Create) {
                  this.addModuleOperations("City-Create", operationLists);
                }
                if (response.authorizationAccessList.City_Edit) {
                  this.addModuleOperations("City-Edit", operationLists);
                }
                if (response.authorizationAccessList.City_View) {
                  this.addModuleOperations("City-View", operationLists);
                }
                if (response.authorizationAccessList.City_Delete) {
                  this.addModuleOperations("City-Delete", operationLists);
                }

                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              if (response.authorizationAccessList.Company_Delete || response.authorizationAccessList.Company_Create || response.authorizationAccessList.Company_Edit || response.authorizationAccessList.Company_View) {
                subModule = new SubModule();
                subModule.subModuleName = "Company";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Company");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Company");
                this.operationLists = [];
                if (response.authorizationAccessList.Company_Create) {
                  this.addModuleOperations("Company-Create", operationLists);
                }
                if (response.authorizationAccessList.Company_Edit) {
                  this.addModuleOperations("Company-Edit", operationLists);
                }
                if (response.authorizationAccessList.Company_View) {
                  this.addModuleOperations("Company-View", operationLists);
                }
                if (response.authorizationAccessList.Company_Delete) {
                  this.addModuleOperations("Company-Delete", operationLists);
                }

                subModule.operations = this.operationLists;
                subModules.push(subModule);

              }
              if (response.authorizationAccessList.Locality_Delete || response.authorizationAccessList.Locality_Create || response.authorizationAccessList.Locality_Edit || response.authorizationAccessList.Locality_View) {
                subModule = new SubModule();
                subModule.subModuleName = "Locality";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Locality");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Locality");
                this.operationLists = [];
                if (response.authorizationAccessList.Locality_Create) {
                  this.addModuleOperations("Locality-Create", operationLists);
                }
                if (response.authorizationAccessList.Locality_Edit) {
                  this.addModuleOperations("Locality-Edit", operationLists);
                }
                if (response.authorizationAccessList.Locality_View) {
                  this.addModuleOperations("Locality-View", operationLists);
                }
                if (response.authorizationAccessList.Locality_Delete) {
                  this.addModuleOperations("Locality-Delete", operationLists);
                }
                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              if (response.authorizationAccessList.Venue_Delete || response.authorizationAccessList.Venue_Create || response.authorizationAccessList.Venue_Edit || response.authorizationAccessList.Venue_View) {
                subModule = new SubModule();
                subModule.subModuleName = "Venue";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Venue");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Venue");
                this.operationLists = [];
                if (response.authorizationAccessList.Venue_Create) {
                  this.addModuleOperations("Venue-Create", operationLists);
                }
                if (response.authorizationAccessList.Locality_Edit) {
                  this.addModuleOperations("Venue-Edit", operationLists);
                }
                if (response.authorizationAccessList.Venue_View) {
                  this.addModuleOperations("Venue-View", operationLists);
                }
                if (response.authorizationAccessList.Venue_Delete) {
                  this.addModuleOperations("Venue-Delete", operationLists);
                }
                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              if (response.authorizationAccessList.Venue_Category_Delete || response.authorizationAccessList.Venue_Category_Create || response.authorizationAccessList.Venue_Category_Edit || response.authorizationAccessList.Venue_Category_View) {
                subModule = new SubModule();
                subModule.subModuleName = "Venue Category";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Venue Category");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Venue Category");
                this.operationLists = [];
                if (response.authorizationAccessList.Venue_Category_Create) {
                  this.addModuleOperations("Venue-Category-Create", operationLists);
                }
                if (response.authorizationAccessList.Venue_Category_Edit) {
                  this.addModuleOperations("Venue-Category-Edit", operationLists);
                }
                if (response.authorizationAccessList.Venue_Category_View) {
                  this.addModuleOperations("Venue-Category-View", operationLists);
                }
                if (response.authorizationAccessList.Venue_Category_Delete) {
                  this.addModuleOperations("Venue-Category-Delete", operationLists);
                }
                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              if (response.authorizationAccessList.Zone_Delete || response.authorizationAccessList.Zone_Create || response.authorizationAccessList.Zone_Edit || response.authorizationAccessList.Zone_View) {
                subModule = new SubModule();
                subModule.subModuleName = "Zone";
                subModule.subModuleRouterLink = this.moduleRouterLinkMap.get("Zone");
                subModule.subModuleIconName = this.moduleIconNameMap.get("Zone");
                this.operationLists = [];
                if (response.authorizationAccessList.Zone_Create) {
                  this.addModuleOperations("Zone-Create", operationLists);
                }
                if (response.authorizationAccessList.Zone_Edit) {
                  this.addModuleOperations("Zone-Edit", operationLists);
                }
                if (response.authorizationAccessList.Zone_View) {
                  this.addModuleOperations("Zone-View", operationLists);
                }
                if (response.authorizationAccessList.Zone_Delete) {
                  this.addModuleOperations("Zone-Delete", operationLists);
                }
                subModule.operations = this.operationLists;
                subModules.push(subModule);
              }
              module.subModules = subModules;
              module.subModules.sort((a: SubModule, b: SubModule) => {
                return a.subModuleName > b.subModuleName ? 1 : -1;
              });

              if (subModules.length > 1) {
                module.subNavHide = false;
              }
              result.push(module);



            }







            // Menu-Mapping
            this.modules = result;

            this.modules.sort((a: Module, b: Module) => {
              return a.moduleName > b.moduleName ? 1 : -1;
            });

            console.log("Modules List", JSON.stringify(this.modules))
            localStorage.setItem("module", JSON.stringify(this.modules));
            console.log("this.result", result)
          } else {
            
            this.router.navigate(["/login"]);
          }

          return result;
        })
        .subscribe(
          result => { },
          err => { }
        );




      if (this.router.url === "/") {
        this.router.navigate(["/dashboard"]);
      }
    }
    this.applicationLayout();
  }

  addModuleOperations(data: any, operationLists: any) {

    let operation = new Operation();
    operation.operationName = data;
    operation.access = true;
    operation.routerLink = this.moduleOperationRouterLinkMap.get(
      data
    );
    this.operationLists.push(operation);
  }

  applicationLayout() {
    const isWindows = navigator.platform.indexOf("Win") > -1 ? true : false;

    if (
      isWindows &&
      !document
        .getElementsByTagName("body")[0]
        .classList.contains("sidebar-mini")
    ) {
      // if we are on windows OS we activate the perfectScrollbar function

      document
        .getElementsByTagName("html")[0]
        .classList.add("perfect-scrollbar-on");
    } else {
      document
        .getElementsByTagName("html")[0]
        .classList.remove("perfect-scrollbar-off");
    }
    const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
    const elemSidebar = <HTMLElement>(
      document.querySelector(".sidebar .sidebar-wrapper")
    );

    this.location.subscribe((ev: PopStateEvent) => {
      this.lastPoppedUrl = ev.url;
    });
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationStart) {
        if (event.url != this.lastPoppedUrl)
          this.yScrollStack.push(window.scrollY);
      } else if (event instanceof NavigationEnd) {
        if (event.url == this.lastPoppedUrl) {
          this.lastPoppedUrl = undefined;
          window.scrollTo(0, this.yScrollStack.pop());
        } else window.scrollTo(0, 0);
      }
    });

    this._router = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        console.log(event)
        elemMainPanel.scrollTop = 0;
        elemSidebar.scrollTop = 0;
      });

    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      let ps = new PerfectScrollbar(elemMainPanel);
      ps = new PerfectScrollbar(elemSidebar);
      console.log(ps)
    }
  }
  ngAfterViewInit() {
    this.runOnRouteChange();
  }
  isMaps(path) {
    var titlee = this.location.prepareExternalUrl(this.location.path());
    titlee = titlee.slice(1);
    if (path == titlee) {
      return false;
    } else {
      return true;
    }
  }
  runOnRouteChange(): void {
    if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
      const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
      const ps = new PerfectScrollbar(elemMainPanel);
      ps.update();
    }
  }
  isMac(): boolean {
    let bool = false;
    if (
      navigator.platform.toUpperCase().indexOf("MAC") >= 0 ||
      navigator.platform.toUpperCase().indexOf("IPAD") >= 0
    ) {
      bool = true;
    }
    return bool;
  }
}
