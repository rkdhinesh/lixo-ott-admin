import { Component, OnInit } from '@angular/core';
import { TempDataService } from '../../../../shared/temp-dataStore';
import { RestService } from '../../../../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleOperations } from '../../../../shared/model/module-operations';
import { Header } from '../../../../shared/services/header';
import { UUID } from '../../../../shared/services/uuid';
import { Operation } from '../../../../shared/model/operation';
import { LogService } from '../../../../shared/services/log.service';
import { environment } from '../../../../../environments/environment';
import { Status } from '../../../../shared/model/response-status-model';

@Component({
  selector: 'app-edit-module-operations',
  templateUrl: './edit-module-operations.component.html',
  styleUrls: ['./edit-module-operations.component.scss']
})
export class EditModuleOperationsComponent implements OnInit {

  selectedData: ModuleOperations;

  constructor(private tempDataService: TempDataService,
    private restService: RestService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) { }

  ngOnInit() {

    this.log.info("Edit Venue ::" + this.tempDataService.currentSelectedData);

    this.tempDataService.currentSelectedData.subscribe(selectedData => this.selectedData = selectedData);
    this.log.info("EDIT METHOD=====" + JSON.stringify(this.selectedData));

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
    this.selectedData.header = header;
    this.selectedData.client = 'lixo';
    this.selectedData.system = 'lixo';
    this.restService.post(this.selectedData, environment.updateModuleAndOperationPath)
      .map((res: any) => {
        return new Status(res.status["statusCode"], res.status["statusDescription"], res.status['transactionId']);

      })
      .subscribe(result => {
        this.log.info(JSON.stringify(result));
        if (result.statusCode = '2000') {
          this.openSnackBar(this.selectedData.moduleName, "Saved Successfully");
          this.router.navigate(['/module-operations']);
        } else {

          this.openSnackBar(result.statusDescription, this.selectedData.moduleName);
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  // Validation part 
  validation() {
    if (this.selectedData.moduleName == '') {
      return 'Module Name is required!';
    } else {
      return false;
    }
  }

  public deleteItem(operation: Operation) {
    const index: number = this.selectedData.moduleOperationList.indexOf(operation);
    if (index !== -1) {
      this.selectedData.moduleOperationList.splice(index, 1);
    }
  }

  public addOperationNameList() {
    let operation = new Operation();
    operation.operationName = this.selectedData.operationName;
    operation.operationDescription = this.selectedData.operationDescription;
    this.selectedData.moduleOperationList.push(operation);

    this.selectedData.operationName = '';
    this.selectedData.operationDescription = '';

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
