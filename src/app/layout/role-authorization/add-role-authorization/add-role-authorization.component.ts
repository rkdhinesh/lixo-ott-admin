import { Component, OnInit, ViewChild } from '@angular/core';
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
import { RoleAuthorizationAccess } from '../../../shared/model/RoleAuthorizationAccess';
import { AuthorizationAccessList } from '../../../shared/model/AuthorizationAccessList';

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
  selector: 'app-add-role-authorization',
  templateUrl: './add-role-authorization.component.html',
  styleUrls: ['./add-role-authorization.component.scss']
})
export class AddRoleAuthorizationComponent implements OnInit {

  selectedData: RoleMaster;
  selectedAuthorizeData: RoleAuthorizationAccess;
  isLoading: boolean = true;
  companyList: DropDownModel[] = [];
  header = new Header(UUID.UUID());
  systemList: DropDownModel[] = [];
  selectedCompany: DropDownModel;
  selectedSystem: DropDownModel;
  dataSource: any;
  showAuthorize = false;
  classSummaryDisplaycolumns = ["authorizationName", "access"];
  classDataSource: any;
  authorizeData: Array<AuthorizationAccessList>;

  constructor(private company: TempDataService,
    private restService: RestService, private route: ActivatedRoute,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {
  }

  ngOnInit() {

    this.loadDefaultValues();
    this.getAllCompanyDetails();
    this.getAllSystemDetails();
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
      role_description: ''
    });
    role.company_id = 0;
    role.system_id = null;
    this.selectedData = role;

    let authorizee = <RoleAuthorizationAccess>({
      roleId: null, authorizationAccesses: Array<AuthorizationAccessList>()
    });
    this.selectedAuthorizeData = authorizee;
  }
  onAccessChange(id: number, access: boolean) {
    console.log("id -- access" + id + access);
    this.authorizeData.find(f => f.authorizationId == id).access = access;

  }


  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.selectedCompany != null) {

      this.selectedData.company_id = this.selectedCompany.id;
    }

    if (this.selectedSystem != null) {

      this.selectedData.system_id = this.selectedSystem.name;
    }


    if (this.selectedCompany != null) {
      this.selectedData.companyName = this.selectedCompany.name;
    }

    if (this.selectedSystem != null) {
      this.selectedData.system_id = this.selectedSystem.name;
    }
    this.selectedAuthorizeData.authorizationAccesses = this.authorizeData;
    let validationMessage = this.validation();
    if (validationMessage == false) {
      this.save();
    } else {
      this.openSnackBar("Please fill the red marked fields", validationMessage);
    }
  }

  // Validation part 
  validation() {
    if (this.selectedData.company_id == 0 || this.selectedData.company_id + '' == 'undefined') {
      return 'Company Name is required!';
    }
    if (this.selectedData.companyName == '' || this.selectedData.companyName + '' == 'undefined') {
      return 'Company Name is required!';
    } else if (this.selectedData.system_id == '' || this.selectedData.system_id + '' == 'undefined') {
      return 'System Id is required!';
    } else if (this.selectedData.role_name == '' || this.selectedData.role_name + '' == 'undefined') {
      return 'Role Name is required!';
    } else if (this.selectedData.role_description == '' || this.selectedData.role_description + '' == 'undefined') {
      return 'Role Description is required!';
    } else {
      return false;
    }
  }

  public save() {

    //Save Role Master
    this.restService.post(this.selectedData, environment.addRoleMaster)
      .subscribe(result => {
        this.log.info(JSON.stringify(result));
        // this.openSnackBar(this.selectedData.role_name, "Saved Successfully");
        this.router.navigate(['/role-authorization']);
        this.selectedAuthorizeData.roleId = result.role_id;
        if (this.selectedAuthorizeData.authorizationAccesses.length != 0) {
          this.saveAuthorizationAccessDetail();
        }
        if (result.statusCode == '1002') {
          this.openSnackBar("Saved Successfully", this.selectedData.role_name);
          this.openSnackBar(result.statusDescription, this.selectedData.role_name);
        } else {
          this.openSnackBar(result.statusDescription, this.selectedData.role_name);
        }
      });

  }

  saveAuthorizationAccessDetail() {
    //Save Role Authorization access
    this.restService.post(this.selectedAuthorizeData, environment.addeditRoleAuthorization)
      .subscribe(result => {
        this.log.info(JSON.stringify(result));
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
  getAllAuthorizationBasedOnCompanyandSystem() {
    if (this.selectedCompany == null || this.selectedCompany.id == 0) {
      return 'Company Name is required!';
    } else if (this.selectedSystem == null || this.selectedSystem.id == 0) {
      return 'System Id is required!';
    }

    this.getAllAuthorization(this.selectedCompany.id, this.selectedSystem.name);
  }

  private getAllAuthorization(companyId: number, systemId: string) {

    this.restService
      .get(environment.getAuthorizationbyCompanyandSystemId + this.selectedCompany.id + "/systemId/" + this.selectedSystem.name)
      .map((response: any) => {
        let result: Array<AuthorizationAccessList> = [];

        if (response) {
          this.showAuthorize = true;
          response.forEach(erg => {

            let authorize = new AuthorizationAccessList();
            authorize.authorizationId = erg.authorization_id;
            authorize.authorizationName = erg.authorization_code;
            authorize.access = false;
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
