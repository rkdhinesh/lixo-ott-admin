import { Component, OnInit, ViewChild } from '@angular/core';
import { ModuleOperations } from '../../../shared/model/module-operations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RestService } from '../../../api.service';
import { Router } from '@angular/router';
import { TempDataService } from '../../../shared/temp-dataStore';
import { Header } from '../../../shared/services/header';
import { UUID } from '../../../shared/services/uuid';
import { YesOrNoDialogComponent } from '../../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { SubModule } from '../../../shared/model/sub-module';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';


export class ModuleOperaion {

  moduleId: string;
  moduleName: string;
  moduleDescription: string;
  subModules: SubModule[];
  dataSource: any;
  addOperationButton: boolean = false;
  displayedColumns: string[] = ['name', 'desc', 'operations'];


  constructor() {

  }


}

@Component({
  selector: 'app-module-operations',
  templateUrl: './module-operations.component.html',
  styleUrls: ['./module-operations.component.scss']
})
export class ModuleOperationsComponent implements OnInit {

  modules: ModuleOperaion[] = [];
  ioObjArray: ModuleOperations[] = [];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['moduleName', 'subModuleName', 'operations', 'action'];
  row: any;
  color = 'primary';
  mode = 'determinate';
  FormObj;
  pageEvent: PageEvent;
  dialogRef;
  deletedialogRef;
  isLoading: boolean = true;
  queryString: string = ""
  errorMessage: string = '';
  addOperationButton: boolean = false;

  constructor(private restService: RestService,
    public dialog: MatDialog, public router: Router,
    public tempDataService: TempDataService, public snackBar: MatSnackBar,
    private log: LogService) {

  }


  /* On load pagenation Event*/
  ngOnInit() {
    this.getAllModuleOperationsDetails();
  }



  editdata(data: any) {
    this.log.info("DATA=====" + JSON.stringify(data));
    this.log.info(JSON.stringify(data));
    this.log.info('setting to datastore');
    this.tempDataService.changeSelecedData(data);

    return true;

  }

  private getAllModuleOperationsDetails() {
    let header = new Header(UUID.UUID());
    let module = <ModuleOperations>({});
    module.header = header;
    module.client = 'lixo';
    module.system = 'lixo';

    this.restService.post(module, environment.viewAllModuleOperationsPath)
      .map((moduleOperationsResponse: any) => {
        let result: Array<ModuleOperaion> = [];
        if (moduleOperationsResponse) {
          moduleOperationsResponse.modules.forEach(erg => {

            let module = new ModuleOperaion();
            module.moduleId = erg.moduleId;
            module.moduleName = erg.moduleName;
            module.moduleDescription = erg.moduleDescription;
            module.subModules = erg.subModules;
            module.dataSource = new MatTableDataSource(module.subModules);
            this.modules.push(module);
            result = this.modules;
          });
        }
        return result;
      })
      .subscribe(result => { }, 
        err => {  });
  }
  /* Delete details**/

  delete(venue: ModuleOperations) {
    this.deletedialogRef = this.dialog.open(YesOrNoDialogComponent, {

      disableClose: true
    });
    this.deletedialogRef.afterClosed().subscribe(result => {
      this.log.info("after closed:result");
      this.log.info(result);
      if (result === true) {
        let header = new Header(UUID.UUID());

        venue.header = header;

        this.deleteDetail(venue);
      } else {

      }
    });
    this.deletedialogRef.componentInstance.modal_name = "DELETE ACCOUNT"
  }

  private deleteDetail(data: any) {
    let venueName: string;
    venueName = data.venueName;
    this.restService.post(data, environment.deleteModuleOperationsPath)
      .map((companies: any) => {
        let result: Array<ModuleOperations> = [];
        if (ModuleOperations instanceof Array) {
          companies.forEach((erg) => {
            this.log.info("Delete===");

            let moduleOperations = <ModuleOperations>({
              moduleId: erg.moduleId,
              moduleDescription: erg.moduleDescription,
              moduleName: erg.moduleName,
              moduleOperationList: erg.moduleOperationList
            });

            result.push(moduleOperations);

          });
          return result;
        } else {
          this.log.info("===============" + companies.status["statusCode"]);
          if (companies.status["statusCode"] = '1001') {
            this.openSnackBar(venueName, "Deleted Successfully");
            this.getAllModuleOperationsDetails();
            this.log.info("--------------" + companies.status["statusCode"]);
          }
        }

      })
      .subscribe(companies => this.ioObjArray = companies);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  myErrorStateMatcher(): boolean {
    return true;
  }
}
