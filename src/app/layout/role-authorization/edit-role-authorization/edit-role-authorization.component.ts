import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../api.service';
import { RoleMaster } from '../../../shared/model/role-master';
import { Header } from '../../../shared/services/header';
import { LogService } from '../../../shared/services/log.service';
import { UUID } from '../../../shared/services/uuid';
import { TempDataService } from '../../../shared/temp-dataStore';
import { environment } from '../../../../environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleAuthorizationAccessRequest } from '../../../shared/model/RoleAuthorizationAccessRequest';
import { RoleAuthorizationAccessList } from '../../../shared/model/RoleAuthorizationAccessList';

export class DropDownModel {
  id: number;
  name: string;
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class AddRoleAuthorizeRequestHeader {
  header = new Header(UUID.UUID());
  constructor() { }
}

@Component({
  selector: 'app-edit-role-authorization',
  templateUrl: './edit-role-authorization.component.html',
  styleUrls: ['./edit-role-authorization.component.scss']
})
export class EditRoleAuthorizationComponent implements OnInit {

  selectedData: RoleMaster;
  selectedAuthorizeData: RoleAuthorizationAccessRequest;
  isLoading: boolean = true;
  companyList: DropDownModel[] = [];
  header = new Header(UUID.UUID());
  systemList: DropDownModel[] = [];
  selectedCompany: any;
  selectedSystem: any;
  role: any;
  dataSource: any;
  showAuthorize = false;
  classSummaryDisplaycolumns = ["authorizationName", "access"];
  classDataSource: any;
  authorizeData: Array<RoleAuthorizationAccessList>;

  constructor(private company: TempDataService, private tempDataService: TempDataService,
    private restService: RestService, private route: ActivatedRoute,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {
  }

  ngOnInit() {

    this.loadDefaultValues();
    this.getAllCompanyDetails();
    this.getAllSystemDetails();

    this.tempDataService.currentSelectedData.subscribe(
      selectedData => (this.selectedData = selectedData)
    );

    this.role = this.selectedData;
    this.selectedCompany = this.selectedData.company_id;
    this.selectedSystem = this.selectedData.system_id;


    this.getAllAuthorization(this.selectedData.company_id, this.selectedData.system_id);


  }

  private getAllCompanyDetails() {
    this.companyList = [];
    let request = new AddRoleAuthorizeRequestHeader();
    request.header = this.header;
    this.restService
      .post(request, environment.viewCompanyPath)
      .map((res: any) => {
        if (res) {
          res.companies.forEach(erg => {
            this.companyList.push(
              new DropDownModel(erg.companyId, erg.companyName)
            );
          });
        }
      })
      .subscribe(
        companyList => { },
        err => { }
      );
  }

  private getAllSystemDetails() {
    this.systemList = [];
    this.restService
      .get(environment.viewSystemPath)
      .map((res: any) => {
        if (res) {
          res.forEach(erg => {
            this.systemList.push(
              new DropDownModel(erg.systemId, erg.systemName)
            );
          });
        }
      })
      .subscribe(
        systemList => { },
        err => { }
      );
  }

  loadDefaultValues() {
    let role = <RoleMaster>({
      role_id: null, role_name: '',
      role_description: '',
      company_id: 0,
      system_id: ''
    });

    this.selectedData = role;

    let authorizee = <RoleAuthorizationAccessRequest>({
      authorizationAccesses: Array<RoleAuthorizationAccessList>()
    });
    this.selectedAuthorizeData = authorizee;
  }

  onAccessChange(id: number, access: boolean) {
    this.authorizeData.find(f => f.authorizationId == id).access = access;
  }

  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.selectedCompany != null) {
      this.selectedData.company_id = this.selectedCompany;
    }

    if (this.selectedSystem != null) {
      this.selectedData.system_id = this.selectedSystem;
    }

    this.selectedAuthorizeData.authorizationAccesses = this.authorizeData;
    let validationMessage = this.validation();
    if (validationMessage == false) {

      if (this.role.company_id !== this.selectedData.company_id || this.role.role_name !== this.selectedData.role_name || this.role.system_id != this.selectedData.system_id) {

        this.save();
      }
      this.saveAuthorizationAccessDetail();

    } else {
      this.openSnackBar("Please fill the red marked fields", validationMessage);
    }
  }

  // Validation part 
  validation() {

    if (this.selectedData.role_name == '' || this.selectedData.role_name + '' == 'undefined') {
      return 'Role Name is required!';
    } else if (this.selectedData.role_description == '' || this.selectedData.role_description + '' == 'undefined') {
      return 'Role Description is required!';
    } else {
      return false;
    }
  }

  public save() {

    //Save Role Master
    this.restService.put(this.selectedData, environment.editRoleMaster)
      .subscribe(result => {

        this.openSnackBar(this.selectedData.role_name, "Saved Successfully");
        this.router.navigate(['/role-authorization']);

        if (result.statusCode == '1002') {
          this.openSnackBar(result.statusDescription, this.selectedData.role_name);
        } else {
          this.openSnackBar(result.statusDescription, this.selectedData.role_name);
        }
      });

  }

  saveAuthorizationAccessDetail() {
    this.selectedAuthorizeData.authorizationAccesses.forEach(data => data.roleId = this.selectedData.role_id);
    //Save Role Authorization acceselectedAuthorizeDatass
    this.restService.put(this.selectedAuthorizeData, environment.addeditRoleAuthorization)
      .subscribe(result => {
        this.openSnackBar(this.selectedData.role_name, "Saved Successfully");
        this.router.navigate(['/role-authorization']);
        if (result.statusCode == '1002') {
          this.openSnackBar(result.statusDescription, this.selectedData.role_name);
        } else {
          this.openSnackBar(result.statusDescription, this.selectedData.role_name);
        }
      });
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  myErrorStateMatcher(): boolean {
    return true;
  }


  private getRoleDetailByRoleId(RoleId: number) {
    this.restService
      .get(environment.getRoleByRoleId + RoleId)
      .map((response: any) => {
        let role = new RoleMaster();
        if (response) {
          role.role_id = response.role_id;
          role.role_name = response.role_name;
          role.role_description = response.role_description;
          role.system_id = response.system_id;
          role.company_id = response.company_id;

        }
        return role;
      })
      .subscribe(
        role => { },
        err => { });
  }
  private getAllAuthorization(companyId: number, systemId: string) {

    this.restService
      .get(environment.getAuthorizationbyCompanyandSystemId + companyId + "/systemId/" + systemId)
      .map((response: any) => {
        let result: Array<RoleAuthorizationAccessList> = [];

        if (response) {
          response.forEach(erg => {

            let authorize = new RoleAuthorizationAccessList();
            authorize.authorizationId = erg.authorization_id;
            authorize.authorizationName = erg.authorization_code;
            authorize.access = false;
            authorize.roleId = this.selectedData.role_id;
            result.push(authorize);
          });
        }
        return result;
      })
      .subscribe(result => {
        this.authorizeData = result;
        this.getAllAuthorizationByRoleId(this.selectedData.role_id);
      }, err => { });
  }

  private getAllAuthorizationByRoleId(RoleId: number) {

    this.restService
      .get(environment.getRoleAuthorizationbyId + RoleId)
      .map((response: any) => {
        let result: Array<RoleAuthorizationAccessList> = [];

        if (response) {
          this.showAuthorize = true;
          response.forEach(erg => {

            let authorize = new RoleAuthorizationAccessList();
            authorize.roleAuthorizationId = erg.roleAuthorizationId;
            authorize.authorizationId = erg.authorizationId;
            authorize.authorizationName = this.authorizeData.find(e => e.authorizationId == authorize.authorizationId).authorizationName;
            authorize.access = erg.access;
            result.push(authorize);
          });
        }
        else {
          this.showAuthorize = false;
        }

        return result;
      })
      .subscribe(result => {
        this.dataSource = new MatTableDataSource(result);
        this.authorizeData = result;
      }, err => { });
  }

}
