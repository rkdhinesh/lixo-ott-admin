import { Component, OnInit } from '@angular/core';
import { Role } from '../../../../shared/model/role';
import { TempDataService } from '../../../../shared/temp-dataStore';
import { RestService } from '../../../../api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UUID } from '../../../../shared/services/uuid';
import { Header } from '../../../../shared/services/header';
import { ModuleOperations } from '../../../../shared/model/module-operations';
import { Operation } from '../../../../shared/model/operation';
import { LogService } from '../../../../shared/services/log.service';
import { environment } from '../../../../../environments/environment';
import { Status } from '../../../../shared/model/response-status-model';

export class RoleRequestHeader {
  header: Header;
  client: string;
  system: string;
  userId: string;
  constructor() { }
}

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.scss']
})
export class EditRoleComponent implements OnInit {
  selectedData: Role;
  isLoading: boolean = true;

  constructor(
    private tempDataService: TempDataService,
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private log: LogService
  ) { }
  ngOnInit() {
    this.tempDataService.currentSelectedData.subscribe(
      selectedData => (this.selectedData = selectedData)
    );

    let header = new Header(UUID.UUID());
    let roleRequest = <RoleRequestHeader>{};
    roleRequest.header = header;
    roleRequest.system = 'lixo';
    roleRequest.client = 'lixo';
    roleRequest.userId = JSON.parse(localStorage.getItem('userId'));

    this.restService
      .post(roleRequest, environment.fetchRoleInformationPath)
      .map((response: any) => {
        let result: Role;
        if (response) {
          result = response.roleEntity;
          this.selectedData.roleId = result.roleId;
          this.selectedData.roleName = result.roleName;
          this.selectedData.roleDescription = result.roleDescription;
          this.selectedData.moduleList = result.moduleList;
        }
        this.log.info(JSON.stringify(this.selectedData));
        return result;
      })
      .subscribe(
        result => { },
        err => { }
      );
  }

  public save() {
    let header = new Header(UUID.UUID());
    this.selectedData.header = header;

    this.restService
      .post(
        this.selectedData,
        environment.updateRoleAndRoleModuleOperationAccessPath
      )
      .map((res: any) => {
        return new Status(
          res.status['statusCode'],
          res.status['statusDescription'],
          res.status['transactionId']
        );
      })
      .subscribe(
        result => {
          this.log.info(JSON.stringify(result));
          if ((result.statusCode == '1001')) {
            this.openSnackBar(this.selectedData.roleName, 'Saved Successfully');
            this.router.navigate(['/roles']);
          } else if ((result.statusCode == '1002')) {
            this.openSnackBar(
              result.statusDescription,
              this.selectedData.roleName
            );
          } else {
            this.openSnackBar(
              result.statusDescription,
              this.selectedData.roleName
            );
          }
        },
        err => {
          var errorVal = err.status.statusDescription;
          this.openSnackBar('ERROR MSG', errorVal);
        }
      );
  }

  allComplete(module: ModuleOperations): boolean {
    const operations = module.moduleOperationList;

    return (
      module.access || (operations != null && operations.every(t => t.access))
    );
  }

  someComplete(operations: Operation[]): boolean {
    const numComplete = operations.filter(t => t.access).length;
    return numComplete > 0 && numComplete < operations.length;
  }

  setAllCompleted(operations: Operation[], completed: boolean) {
    operations.forEach(t => (t.access = completed));
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
  myErrorStateMatcher(): boolean {
    return true;
  }
}
