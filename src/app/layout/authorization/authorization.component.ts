import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../api.service';
import { Authorization } from '../../shared/model/authorization';
import { Header } from '../../shared/services/header';
import { UUID } from '../../shared/services/uuid';
import { TempDataService } from '../../shared/temp-dataStore';
import { environment } from '../../../environments/environment';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { LogService } from '../../shared/services/log.service';
import { ScreenAccessService } from '../../shared/services/screen-access.service';
import { DropDownModel } from './edit-authorization/edit-authorization.component';

export class AddAuthorizationRequestHeader {
  header = new Header(UUID.UUID());
  constructor() { }
}

@Component({
  selector: 'app-authorization',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['company', 'system', 'authorization', 'action'];
  dialogRef;
  deletedialogRef;
  ioObjArray: Authorization[] = [];
  results: any[] = [];
  selectedData: Authorization;
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

    this.screenAccess.loadOperationsAccessForScreen('Role Management', 'Authorization');
    this.operationAccessMap = this.screenAccess.map;
    this.getAllCompanyDetails();
    this.getAllSystemDetails();

  }
  editdata(data: any) {
    console.log("data details" + JSON.stringify(data));
    this.log.info(JSON.stringify(data));
    this.log.info('setting to datastore');
    this.log.info('DATA=====' + JSON.stringify(data));
    data.editable = false;
    this.tempDataService.changeSelecedData(data);
    return true;
  }

  private getAllCompanyDetails() {
    this.companyList = [];
    let request = new AddAuthorizationRequestHeader();
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
          this.restService.get(environment.getAllAuthorization)
            .map((response: any) => {
              let result: Array<Authorization> = [];
              if (response) {
                response.forEach(erg => {
                  let authorize = new Authorization();
                  authorize.authorization_id = erg.authorization_id;
                  authorize.authorization_code = erg.authorization_code;
                  authorize.authorization_description = erg.authorization_description;
                  authorize.system_id = erg.system_id;
                  authorize.company_id = erg.company_id;
                  authorize.companyName = this.companyList.find(c => c.id == authorize.company_id).name;
                  result.push(authorize);
                });
              }
              console.log("result" + result);
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
        this.openSnackBar("Successfully deleted", uniqueaccountType.name);
        this.getAllCompanyDetails();
      } else {

      }
    });
    this.deletedialogRef.componentInstance.modal_name = "DELETE ACCOUNT"
  }

  private deleteDetail(data: any) {

    this.log.info("Delete Method" + JSON.stringify(data));

    this.restService.delete(environment.deleteAuthorization + data.authorization_id)
      .map((authorize: any) => {
        let result: Array<Authorization> = [];
        if (Authorization instanceof Array) {
          authorize.forEach((erg) => {
            this.log.info("Delete===");
            result.push(new Authorization());

          });
          return result;
        } else {
          this.log.info("===============" + authorize.status.statusCode);
          if (authorize.status.statusCode == '1001') {
            this.openSnackBar("Deleted Successfully", data.roleName);
            this.ngOnInit();
            this.log.info("--------------" + authorize.status.statusCode);
          }
        }

      })
      .subscribe(authorize => this.ioObjArray = authorize);

  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
