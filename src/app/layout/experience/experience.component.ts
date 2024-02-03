import { Component, OnInit, ViewChild } from '@angular/core';
import { Experience } from './experience';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Headers } from '../../shared/model/request-header';
import { Header } from '../../shared/services/header';
import { UUID } from '../../shared/services/uuid';
import { RestService } from '../../api.service';
import { LogService } from '../../shared/services/log.service';
import { TempDataService } from '../../shared/temp-dataStore';
import { ScreenAccessService } from '../../shared/services/screen-access.service';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {

  
  ioObjArray: Experience[] = [];
  selectedData: Experience;
  headers: Headers;
  header = new Header(UUID.UUID());
  errorMessage: string = '';
  data: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['Name', 'description', 'action'];

  color = 'primary';
  mode = 'determinate';
  FormObj;
  pageEvent: PageEvent;
  dialogRef;
  deletedialogRef;
  operationAccessMap = new Map();

  constructor(private restService: RestService, private log: LogService,
      public dialog: MatDialog, public router: Router, public snackBar: MatSnackBar,
      public tempDataService: TempDataService,private screenAccess: ScreenAccessService) { }

  /* On load pagenation Event*/
  ngOnInit() {
      
      this.headers = <Headers>{
          header: this.header
      }
      this.screenAccess.loadOperationsAccessForScreen('Movie Management', 'Experience');
      this.operationAccessMap = this.screenAccess.map;
      this.getAllExperienceDetail();
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

  viewDetailsdata(data: any) {
      this.log.info("DATA=====" + JSON.stringify(data));
      this.log.info(JSON.stringify(data));
      this.log.info('setting to datastore');
      data.editable = true;
      this.tempDataService.changeSelecedData(data);
      return true;

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


      let deleteExperience = <Experience>({
          id: data.id,
          header: this.header
      })
      // data.header=this.headervalue;
      this.log.info("Delete Method" + JSON.stringify(data));

      this.restService.post(deleteExperience, environment.deleteVenueCategoryPath)
          .map((experience: any) => {
              let result: Array<Experience> = [];
              if (Experience instanceof Array) {
                experience.forEach((erg) => {
                      this.log.info("Delete===");
                      result.push(new Experience(erg.id, erg.name, erg.description));

                  });
                  return result;
              } else {
                  this.log.info("===============" + experience.status.statusCode);
                  if (experience.status.statusCode = '1003') {
                      this.openSnackBar("Deleted Successfully", data.name);
                      this.getAllExperienceDetail();
                      this.log.info("--------------" + experience.status.statusCode);
                  }
              }

          })
          .subscribe(experiences => this.ioObjArray = experiences);

  }

  /* Get Details**/
  private getAllExperienceDetail(): any {
      this.restService.post(this.headers, environment.getAllVenueCategoryPath)
          .map((response: any) => {
              let result: Array<Experience> = [];
              if (response) {
                  response.experiences.forEach(erg => {
                      let obj = new Experience(erg.id, erg.name,erg.description);
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