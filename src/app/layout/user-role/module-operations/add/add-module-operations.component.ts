import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Header } from '../../../../shared/services/header';
import { UUID } from '../../../../shared/services/uuid';
import { Module } from '../../../../shared/model/module';
import { SubModule } from '../../../../shared/model/sub-module';
import { LogService } from '../../../../shared/services/log.service';
import { environment } from '../../../../../environments/environment';
import { Status } from '../../../../shared/model/response-status-model';
import { OperationDialogComponent, DialogData } from '../operation-dialog/operation-dialog.component';

export class AddModuleOperationsRequest {
  header: Header;
  module: Module;

  constructor() { }
}


@Component({
  selector: 'app-add-module-operations',
  templateUrl: './add-module-operations.component.html',
  styleUrls: ['./add-module-operations.component.scss']
})
export class AddModuleOperationsComponent implements OnInit {

  module: Module;
  subModules: SubModule[];
  moduleFlag: boolean = true;
  subModuleFlag: boolean = false;
  moduleName: string;
  moduleDescription: string;
  subModuleName: string;
  subModuleDescription: string;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['name', 'description', "operations", 'action'];
  color = 'primary';

  constructor(private restService: RestService, public dialog: MatDialog,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {

  }

  ngOnInit() {
this.module  = new Module
    this.subModules = [];
  }

  public moduleNext() {
    this.moduleFlag = false;
    this.subModuleFlag = true;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(OperationDialogComponent, {

      data: { moduleName: this.moduleName, subModuleName: this.subModuleName }
    });

    dialogRef.afterClosed().subscribe(result => {
      let popupData: DialogData = result;
      let operations = popupData.operations;

      let subModule = new SubModule();
      subModule.subModuleName = this.subModuleName;
      subModule.subModuleDescription = this.subModuleDescription
      subModule.operations = operations;
      this.subModules.push(subModule);

      this.dataSource = new MatTableDataSource(this.subModules);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    });
  }


  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");

    let validationMessage = this.validation();
    if (validationMessage == false) {
      this.save();
    } else {
      this.openSnackBar("Please fill the red marked fields", validationMessage);
    }
  }
  private save() {

    let header = new Header( UUID.UUID());
    
    let request : AddModuleOperationsRequest = new AddModuleOperationsRequest();
    request.header = header;
    this.module.moduleName = this.moduleName;
    this.module.moduleDescription = this.moduleDescription;
    this.module.subModules = this.subModules;
    request.module = this.module;



    this.restService.post(request, environment.addModuleAndOperationPath)
      .map((res: any) => {
        this.log.info("SAVE****");
        return new Status(res.status["statusCode"], res.status["statusDescription"], res.status['transactionId']);
      })
      .subscribe(result => {
        this.log.info(JSON.stringify(result));
        if (result.statusCode = '2000') {
          this.openSnackBar(this.moduleName, "Saved Successfully");

          this.router.navigate(['/module-operations']);

        } else {

          this.openSnackBar(result.statusDescription, this.moduleName);
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  // Validation part 
  validation() {
    if (this.module.moduleName == '') {
      return 'Module Name is required!';
    } else {
      return false;
    }
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
