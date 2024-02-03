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
  selector: 'app-view-role-authorization',
  templateUrl: './view-role-authorization.component.html',
  styleUrls: ['./view-role-authorization.component.scss']
})
export class ViewRoleAuthorizationComponent implements OnInit {

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
  classSummaryDisplaycolumns = ["authorizationName","access"];
  classDataSource: any;
  authorizeData: Array<AuthorizationAccessList>;

  constructor(private company: TempDataService,private tempDataService: TempDataService,
    private restService: RestService, private route: ActivatedRoute,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {
  }

  ngOnInit() {

    this.loadDefaultValues();
    // this.getAllCompanyDetails();

    this.tempDataService.currentSelectedData.subscribe(
      selectedData => (this.selectedData = selectedData)
    );


  //  this.getRoleDetailByRoleId(this.selectedData.roleId);
    this.getAllAuthorization(this.selectedData.company_id,this.selectedData.system_id);
    this.getAllAuthorizationByRoleId(this.selectedData.role_id);
  }

  // private getAllCompanyDetails() {
  //   this.companyList = [];
  //   let request = new AddRoleAuthorizeRequestHeader();
  //   request.header = this.header;
  //   this.restService
  //     .post(request, environment.viewCompanyPath)
  //     .map((res: any) => {
  //       if (res) {
  //         res.companies.forEach(erg => {
  //           this.companyList.push(
  //             new DropDownModel(erg.companyId, erg.companyName)
  //           );
  //         });
  //       }
  //     })
  //     .subscribe(
  //       companyList => { },
  //       err => { }
  //     );
  // }

  loadDefaultValues() {
    let role = <RoleMaster>({
      role_id: null, role_name: '',
      role_description: ''
    });
    role.company_id = 0;
    role.system_id = null;
    this.selectedData = role;

    let authorizee = <RoleAuthorizationAccess>({
     roleId:null,authorizationAccesses:Array<AuthorizationAccessList>()
    });
    this.selectedAuthorizeData=authorizee;
  }

  // private getRoleDetailByRoleId(RoleId:number)
  // {
  //   this.restService
  //     .get(environment.getRoleByRoleId+RoleId)
  //     .map((response: any) => {
  //       let role = new RoleMaster();
  //       if (response) {
  //         role.roleId = response.roleId;
  //         role.roleName = response.rolename;
  //         role.roleDescription=response.roleDescription;
  //         role.systemId=response.systemId;
  //         role.companyId=response.companyId;
  //       }
  //       return role;
  //     })
  //     .subscribe(result => {
  //       this.selectedData=result;
  //       this.selectedCompany.id=this.selectedData.companyId;
  //       this.selectedSystem.name=this.selectedData.systemId;
  //     }, err => { });
  // }
  private getAllAuthorization(companyId:number,systemId:string) {

    this.restService
      .get(environment.getAuthorizationbyCompanyandSystemId+1+"/systemId/moviepanda-admin")
      .map((response: any) => {
       let result: Array<AuthorizationAccessList> = [];
        
        if (response) {
            response.forEach(erg => {
              
                let authorize = new AuthorizationAccessList();
                authorize.authorizationId = erg.authorization_id;
                authorize.authorizationName = erg.authorization_code;
                authorize.access=false;
                result.push(authorize);
            });
        }
        return result;
      })
      .subscribe(result => {
        this.authorizeData=result;
    }, err => { });
  }

  private getAllAuthorizationByRoleId(RoleId:number) {

    this.restService
      .get(environment.getRoleAuthorizationbyId+RoleId)
      .map((response: any) => {
       let result: Array<AuthorizationAccessList> = [];
        
        if (response) {
            this.showAuthorize=true;
            response.forEach(erg => {
              
                let authorize = new AuthorizationAccessList();
                authorize.roleAuthorizationId=erg.roleAuthorizationId;
                authorize.authorizationId = erg.authorization_id;
                authorize.authorizationName = this.authorizeData.find(e=>e.authorizationId==authorize.authorizationId).authorizationName;
                authorize.access=erg.access;
                result.push(authorize);
            });
        }
        else
        {
          this.showAuthorize=false;
        }
        return result;
      })
      .subscribe(result => {
        this.dataSource = new MatTableDataSource(result);
        this.authorizeData=result;
    }, err => { });
  }

}
