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
import { CineastMember } from './cineast-member';
import { ScreenAccessService } from '../../shared/services/screen-access.service';

@Component({
  selector: 'app-cineast-member',
  templateUrl: './cineast-member.component.html',
  styleUrls: ['./cineast-member.component.scss']
})
export class CineastMemberComponent implements OnInit {
  selecteddata: CineastMember;
  headers: Headers;
  header = new Header(UUID.UUID());
  errorMessage: string;
  ioObjArray: CineastMember[] = [];
  getAllCineast: '/admin-service/api/rest/v1/manage-cineast/get-all-cineasts';

  operationAccessMap = new Map();

  
  data: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['cineastName', 'profileImage', 'action'];

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
    this.screenAccess.loadOperationsAccessForScreen('Cineast Management', 'Cineast Member');
    this.operationAccessMap = this.screenAccess.map;
    this.getAllCineastDetail();
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
      } else {

      }
    });
    this.deletedialogRef.componentInstance.modal_name = 'DELETE ACCOUNT'
  }

  deleteDetail(data: any) {
    const deleteCineast = <CineastMember>({
      cineastId: data.cineastId,
      header: this.header

    })

    this.log.info('Delete Method' + JSON.stringify(data));

    this.restService.post(deleteCineast, environment.deleteCineastMember)
      .map((cineasts: any) => {
        const result: Array<CineastMember> = [];
        if (CineastMember instanceof Array) {
          cineasts.forEach((erg) => {
            this.log.info('Delete===');
            result.push(new CineastMember(erg.cineastId, erg.cineastName,
              erg.profileImage));
          });
          return result;
        } else {

          this.log.info('===============' + cineasts.status.statusCode);
          if (cineasts.status.statusCode == '1001') {
            this.openSnackBar('Deleted Successfully', data.cineastName);
            this.getAllCineastDetail();
          } else if (cineasts.status.statusCode == '1002') {
            this.openSnackBar('Operation Failed', data.cineastName);
          } else if (cineasts.status.statusCode == '1004') {
            this.openSnackBar(cineasts.status.statusDescription, "cineast member already exit");
          }
        }

      })
      .subscribe(cineasts => this.ioObjArray = cineasts);
  }

  editdata(data: any) {
    this.log.info('DATA=====' + JSON.stringify(data));
    this.log.info(JSON.stringify(data));
    this.log.info('setting to datastore');
    data.editable = false;
    this.tempDataService.changeSelecedData(data);
    return true;

  }



  /* Get Details**/
  getAllCineastDetail() {
    this.restService.post(this.headers, environment.getAllCineastMember)
      .map((response: any) => {
        const result: Array<CineastMember> = [];
        if (response) {
          response.cineasts.forEach(erg => {
            const obj = new CineastMember(erg.cineastId, erg.cineastName,
              erg.profileImage);
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
