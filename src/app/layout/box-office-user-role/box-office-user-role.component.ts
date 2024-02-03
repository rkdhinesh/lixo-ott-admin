import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RestService } from '../../api.service';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { User } from '../../shared/model/user';
import { UserRole } from '../../shared/model/user-role';
import { Header } from '../../shared/services/header';
import { LogService } from '../../shared/services/log.service';
import { UUID } from '../../shared/services/uuid';
import { TempDataService } from '../../shared/temp-dataStore';
import { environment } from '../../../environments/environment';
import { DropDownModel } from './edit-user-role/edit-user-role.component';
import { RoleUser } from '../../shared/model/RoleUser';
import { ScreenAccessService } from '../../shared/services/screen-access.service';

export class UserRoleRequestHeader {
  header: Header;
  constructor() { }
}
@Component({
  selector: 'app-box-office-user-role',
  templateUrl: './box-office-user-role.component.html',
  styleUrls: ['./box-office-user-role.component.scss']
})
export class BoxOfficeUserRoleComponent implements OnInit {

  dialogRef;
  deletedialogRef;
  ioObjArray: RoleUser[] = [];
  selectedData: UserRole;
  userLists: User[] = [];
  data: any;
  userRoles: any;
  userRole: any;
  headers: Headers;
  header = new Header(UUID.UUID());
  operationAccessMap = new Map();
  errorMessage: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns = ['user', 'role', 'action'];
  getUser: any;
  roleList: any[];
  constructor(public router: Router, private restService: RestService,
    private log: LogService, public tempDataService: TempDataService,
    private screenAccess: ScreenAccessService,
    public snackBar: MatSnackBar, public dialog: MatDialog) { }

  ngOnInit() {
    this.screenAccess.loadOperationsAccessForScreen('User Management', 'Box Office Users');
    this.operationAccessMap = this.screenAccess.map;
   this.getAllRoles();
  
  }

  
  private getAllUserInformations() {

    this.restService.get(environment.getAllRoleUser)
        .map((response: any) => {
          
            let userRoles: Array<RoleUser> = [];
            if (response) {
                response.forEach(erg => {
                        let userRole = new RoleUser();
                        userRole.userId = erg.user_id;
                        localStorage.setItem("userId", JSON.stringify(userRole.userId));
                        userRole.roleId = erg.role_id;
                        console.log("role_id",userRole.roleId)
                        userRole.roleName = this.roleList.find(e=>e.id == erg.role_id ).name;
                        userRole.userRoleId = erg.user_role_id;
                        userRole.companyId = erg.company_id;
                        if(erg.system_id === "box-office")
                        {
                          userRoles.push(userRole);
                       
                        }
                     
                });
            }
            return userRoles;
        })
        .subscribe(result => {
            this.dataSource = new MatTableDataSource(result);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        }, err => {

        });
}
private  getAllRoles() {

  this.roleList = [];
 this.restService
    .get(environment.getAllRoleMaster)
    .map((res: any) => {
      if (res) {
        res.forEach(erg => {
          this.roleList.push(new DropDownModel(erg.role_id, erg.role_name));
        });
      }
    })
    .subscribe(
      roleList => { this.getAllUserInformations(); },
      err => { }
    );
}




  selectRole(userRole: UserRole) {
    this.log.info(JSON.stringify(userRole));
  }
  /* Delete details**/

 delete(uniqueaccountType) {
  this.deletedialogRef = this.dialog.open(YesOrNoDialogComponent, {

      disableClose: true
  });
  this.deletedialogRef.afterClosed().subscribe(result => {
      this.log.info("after closed:result");
      this.log.info(result);
      if (result === true) {
          this.deleteDetail(uniqueaccountType);
          this.openSnackBar("Successfully deleted", uniqueaccountType.name);
      } else {

      }
  });
  this.deletedialogRef.componentInstance.modal_name = "DELETE ACCOUNT"
}

private deleteDetail(data: any) {

  let header = new Header(UUID.UUID());

  this.log.info("Delete Method" + JSON.stringify(data));

  this.restService.delete(environment.deleteRoleUser+data.userRoleId)
      .map((userroles: any) => {
          let result: Array<RoleUser> = [];
          if (RoleUser instanceof Array) {
              userroles.forEach((erg) => {
                  this.log.info("Delete===");
                  result.push(new RoleUser());

              });
              return result;
          } else {
              this.log.info("===============" + userroles.statusCode);
              if (userroles.statusCode == '1001') {
                  this.openSnackBar("Deleted Successfully", data.userId);
                  this.ngOnInit();
                  this.log.info("--------------" + userroles.statusCode);
              } else if (userroles.status.statusCode == '1002') {
                  this.openSnackBar(userroles.statusDescription, data.userId);
              } else {
                  this.openSnackBar(userroles.statusDescription, "error");
              }
          }

      })
      .subscribe(userRoles => this.ioObjArray = userRoles);

}
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  editdata(data: any) {
    this.tempDataService.changeSelecedData(data);
    localStorage.setItem("userId", JSON.stringify(data.userId).replace(/\"/g, ""));
    this.getUser = localStorage.getItem("userId");
    return true;
  }

}
