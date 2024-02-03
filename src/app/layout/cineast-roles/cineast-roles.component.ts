import { Component, OnInit, ViewChild } from '@angular/core';
import { Headers } from '../../shared/model/request-header';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RestService } from '../../api.service';
import { Router } from '@angular/router';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { UUID } from '../../shared/services/uuid';
import { TempDataService } from '../../shared/temp-dataStore';
import { environment } from '../../../environments/environment';
import { LogService } from '../../shared/services/log.service';
import { Header } from '../../shared/services/header';
import { CineastRoles } from './cineast-roles';
import { ScreenAccessService } from '../../shared/services/screen-access.service';

@Component({
  selector: 'app-cineast-roles',
  templateUrl: './cineast-roles.component.html',
  styleUrls: ['./cineast-roles.component.scss']
})
export class CineastRolesComponent implements OnInit {
  selecteddata: CineastRoles;
  headers: Headers;
  header = new Header(UUID.UUID());
  errorMessage: string;
  ioObjArray: CineastRoles[] = [];

  getAllCineastRoles = '/admin-service/api/rest/v1/cineast/role-get-all';

  data: any;

  operationAccessMap = new Map();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['roleName', 'roleDescription', 'roleType', 'action'];

  color = 'primary';
  mode = 'determinate';
  FormObj;
  pageEvent: PageEvent;
  dialogRef;
  deletedialogRef;

  constructor(private restService: RestService, public dialog: MatDialog,
    public router: Router, public tempDataService: TempDataService,
    private screenAccess: ScreenAccessService,
    public snackBar: MatSnackBar, private log: LogService) { }

  /* On load pagenation Event*/
  ngOnInit() {

    this.headers = <Headers>{
      header: this.header
    }

    this.screenAccess.loadOperationsAccessForScreen('Cineast Management', 'Cineast Roles');
    this.operationAccessMap = this.screenAccess.map;

    this.getAllCineastRoleDetail();
  }


  /* Delete details**/

  delete(uniqueaccountType) {

    this.deletedialogRef = this.dialog.open(YesOrNoDialogComponent, {

      disableClose: true
    });
    this.deletedialogRef.afterClosed().subscribe(result => {

      this.log.info('after closed:result');
      this.log.info(result);
      if (result === true) {

        this.deleteDetail(uniqueaccountType);
        // this.openSnackBar("Successfully deleted", uniqueaccountType.roleName);
      } else {
        // this.openSnackBar("Failed deleted", uniqueaccountType.roleName);
      }
    });
    this.deletedialogRef.componentInstance.modal_name = 'DELETE ACCOUNT'
  }

  deleteDetail(data: any) {
    const deleteCineastRoles = <CineastRoles>({
      roleId: data.roleId,
      header: this.header

    })

    // data.header=this.headervalue;
    this.log.info('Delete Method' + JSON.stringify(data));

    this.restService.post(deleteCineastRoles, environment.deleteCineastRole)
      .map((roles: any) => {
        const result: Array<CineastRoles> = [];
        if (CineastRoles instanceof Array) {
          roles.forEach((erg) => {
            this.log.info('Delete===');
            result.push(new CineastRoles(erg.roleId, erg.roleName, erg.roleDescription,
              erg.roleType));
          });
          return result;
        } else {

          this.log.info('===============' + roles.status.statusCode);
          if (roles.status.statusCode == '1001') {
            this.openSnackBar('Deleted Successfully', data.roleName);
            this.getAllCineastRoleDetail();
            this.log.info('--------------' + roles.status.statusCode);
          } if (roles.status.statusCode == '1002') {
            this.openSnackBar(roles.status.statusDescription, data.roleName);
          }
        }

      })
      .subscribe(roles => this.ioObjArray = roles);
  }

  /* Edit Details **/
  editdata(data: any) {
    this.log.info("DATA=====" + JSON.stringify(data));
    this.log.info(JSON.stringify(data));
    this.log.info('setting to datastore');
    data.editable = false;
    this.tempDataService.changeSelecedData(data);
    return true;

  }



  /* Get Details**/
  getAllCineastRoleDetail() {

    this.restService.post(this.headers, environment.getAllCineastRole)

      .map((response: any) => {
        const result: Array<CineastRoles> = [];
        if (response) {
          response.roles.forEach(erg => {
            const obj = new CineastRoles(erg.roleId, erg.roleName, erg.roleDescription,
              erg.roleType);
            result.push(obj);
          });
        }
        return result;
      })
      .subscribe(result => {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
