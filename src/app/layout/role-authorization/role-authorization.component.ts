import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { LogService } from '../../shared/services/log.service';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { RoleMaster } from '../../shared/model/role-master';
import { Header } from '../../shared/services/header';
import { UUID } from '../../shared/services/uuid';
import { RestService } from '../../api.service';
import { TempDataService } from '../../shared/temp-dataStore';
import { ScreenAccessService } from '../../shared/services/screen-access.service';
import { DropDownModel } from './edit-role-authorization/edit-role-authorization.component';

export class AddRoleMasterRequestHeader {
  header = new Header(UUID.UUID());
  constructor() { }
}

@Component({
  selector: 'app-role-authorization',
  templateUrl: './role-authorization.component.html',
  styleUrls: ['./role-authorization.component.scss']
})
export class RoleAuthorizationComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['roles', 'description', 'company', 'system', 'action'];
  dialogRef;
  deletedialogRef;
  ioObjArray: RoleMaster[] = [];
  selectedData: RoleMaster;
  headers: Headers;
  header = new Header(UUID.UUID());
  companyList: DropDownModel[] = [];
  systemList: DropDownModel[] = [];
  operationAccessMap = new Map();
  errorMessage

  constructor(public router: Router, private restService: RestService,
    public tempDataService: TempDataService,
    private screenAccess: ScreenAccessService,
    public snackBar: MatSnackBar, private log: LogService, public dialog: MatDialog) { }

  ngOnInit() {

    this.screenAccess.loadOperationsAccessForScreen('Role Management', 'Role');
    this.operationAccessMap = this.screenAccess.map;
    this.getAllCompanyDetails();
    this.getAllSystemDetails();

  }
  editdata(data: any) {
    this.tempDataService.changeSelecedData(data);
    return true;

  }
  private getAllCompanyDetails() {
    this.companyList = [];
    let request = new AddRoleMasterRequestHeader();
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
        companyList => {
          this.restService.get(environment.getAllRoleMaster)
            .map((response: any) => {
              let result: Array<RoleMaster> = [];
              if (response) {
                response.forEach(erg => {
                  let role = new RoleMaster();
                  role.role_id = erg.role_id;
                  role.role_name = erg.role_name;
                  role.role_description = erg.role_description;
                  role.system_id = erg.system_id;
                  role.company_id = erg.company_id;
                  role.companyName = this.companyList.find(c => c.id == role.company_id).name;
                  result.push(role);
                });
              }
              return result;
            })
            .subscribe(result => {
              this.dataSource = new MatTableDataSource(result);
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
            }, err => { });
        },
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
        this.openSnackBar("Successfully deleted", uniqueaccountType.role_name);
        this.router.navigate(['/role-authorization']);

      } else {

      }
    });
    this.deletedialogRef.componentInstance.modal_name = "DELETE ACCOUNT"

  }

  private deleteDetail(data: any) {

    this.log.info("Delete Method" + JSON.stringify(data));

    this.restService.delete(environment.deleteRoleMaster + data.role_id)
      .map((roles: any) => {
        let result: Array<RoleMaster> = [];
        if (RoleMaster instanceof Array) {
          roles.forEach((erg) => {
            this.log.info("Delete===");
            result.push(new RoleMaster());

          });
          return result;
        } else {
          this.log.info("===============" + roles.status.statusCode);
          if (roles.status.statusCode == '1001') {
            this.openSnackBar("Deleted Successfully", data.role_name);
            this.ngOnInit();
            this.log.info("--------------" + roles.status.statusCode);
          }
        }

      })
      .subscribe(deleteroles => this.ioObjArray = deleteroles);

  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
