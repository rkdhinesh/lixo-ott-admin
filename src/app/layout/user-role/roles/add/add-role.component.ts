import { Component, OnInit } from '@angular/core';
import { Role } from '../../../../shared/model/role';
import { RestService } from '../../../../api.service';
import { Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleOperations } from '../../../../shared/model/module-operations';
import { UUID } from '../../../../shared/services/uuid';
import { Header } from '../../../../shared/services/header';
import { Operation } from '../../../../shared/model/operation';
import { LogService } from '../../../../shared/services/log.service';
import { environment } from '../../../../../environments/environment';
import { Status } from '../../../../shared/model/response-status-model';

export class Modules {

  moduleId: string;
  moduleName: string;
  moduleDescription: string;
  subModules: SubModules[] = [];
  dataSource: any;
  displayedColumns: string[] = [];
  constructor() { }
}

export class SubModules {

  subModuleId: string;
  subModuleName: string;
  subModuleDescription: string;
  map = new Map();
  operations: Operation[];

}

@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {

  modules: Modules[] = [];

  selectedData: Role;
  isLoading: boolean = true;

  constructor(private restService: RestService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {


  }

  ngOnInit() {
    this.loadDefaultValues();
    this.getAllModuleOperationsDetails();
  }

  private getAllModuleOperationsDetails() {
    let header = new Header(UUID.UUID());
    let module = <ModuleOperations>({});
    module.header = header;
    module.client = 'lixo';
    module.system = 'lixo';

    this.restService.post(module, environment.viewAllModuleOperationsPath)
      .map((moduleOperationsResponse: any) => {
        if (moduleOperationsResponse) {
          moduleOperationsResponse.modules.forEach(erg => {
            this.log.info(" " + erg.moduleName);

            let module = new Modules();
            module.moduleId = erg.moduleId;
            module.moduleName = erg.moduleName;
            module.moduleDescription = erg.moduleDescription;

            let map = new Map();

            erg.subModules.forEach(sub => {
              let subModule = new SubModules();
              subModule.subModuleName = sub.subModuleName;
              subModule.subModuleId = sub.subModuleId;
              subModule.subModuleDescription = sub.subModuleDescription;

              for (let obj of sub.operations) {
                map.set(obj.operationName, false);
              }
              subModule.map = map;
              module.subModules.push(subModule);
            });


            let displayedColumns = [];
            displayedColumns.push("Sub Module");

            map.forEach((value: boolean, key: string) => {
              this.log.info(key + " -" + value);
              displayedColumns.push(key);
            });

            module.displayedColumns = displayedColumns;
            module.dataSource = new MatTableDataSource(module.subModules);
            this.modules.push(module);
          })
        }

      })
      .subscribe(result => { }, 
        err => { }
        );
  }

  loadDefaultValues() {
    let role = <Role>({
      roleId: null, roleName: '',
      roleDescription: ''
    });
    role.client = 'lixo';
    role.system = 'lixo';
    this.selectedData = role;
  }

  public save() {


    let header = new Header(UUID.UUID());
    this.selectedData.header = header;

    this.restService.post(this.selectedData, environment.addRoleAndRoleModuleOperationAccessPath)
      .map((res: any) => {
        return new Status(res.status["statusCode"], res.status["statusDescription"], res.status['transactionId']);
      })
      .subscribe(result => {
        this.log.info(JSON.stringify(result));
        if (result.statusCode == '1001') {
          this.openSnackBar(this.selectedData.roleName, "Saved Successfully");
          this.router.navigate(['/roles']);
        } else if (result.statusCode == '1002') {
          this.openSnackBar(result.statusDescription, this.selectedData.roleName);
        } else {
          this.openSnackBar(result.statusDescription, this.selectedData.roleName);
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  allComplete(module: ModuleOperations): boolean {
    const operations = module.moduleOperationList;

    return module.access || (operations != null && operations.every(t => t.access));
  }

  someComplete(operations: Operation[]): boolean {
    const numComplete = operations.filter(t => t.access).length;
    return numComplete > 0 && numComplete < operations.length;
  }

  setAllCompleted(operations: Operation[], completed: boolean) {
    operations.forEach(t => t.access = completed);
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
