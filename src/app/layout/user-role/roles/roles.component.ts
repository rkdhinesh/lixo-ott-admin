import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../../api.service';
import { Header } from '../../../shared/services/header';
import { UUID } from '../../../shared/services/uuid';
import { Role } from '../../../shared/model/role';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TempDataService } from '../../../shared/temp-dataStore';
import { LogService } from '../../../shared/services/log.service';
import { YesOrNoDialogComponent } from '../../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { environment } from '../../../../environments/environment';

export class RoleRequestHeader {
    header: Header;
    constructor() { }
}

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
    styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: any;
    displayedColumns: string[] = ['roles', 'description', 'action'];
    dialogRef;
    deletedialogRef;
    ioObjArray: Role[] = [];
    selectedData: Role;
    headers: Headers;
    header = new Header(UUID.UUID());
    errorMessage

    constructor(public router: Router, private restService: RestService,
        public tempDataService: TempDataService, public snackBar: MatSnackBar, private log: LogService, public dialog: MatDialog) { }

    ngOnInit() {

        let header = new Header(UUID.UUID());
        let roleRequest = <RoleRequestHeader>({});
        roleRequest.header = header;
        this.restService.post(roleRequest, environment.getAllRolePath)
            .map((response: any) => {
                let result: Array<Role> = [];
                if (response) {
                    response.roles.forEach(erg => {
                        let role = new Role();
                        role.roleId = erg.roleId;
                        role.roleName = erg.roleName;
                        role.roleDescription = erg.roleDescription;
                        result.push(role);
                    });
                }
                return result;
            })
            .subscribe(result => {
                this.dataSource = new MatTableDataSource(result);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            }, 
            );
    }

    editdata(data: any) {
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


        let deleterole = <Role>({
            roleId: data.roleId,
            client: "lixo",
            system: "lixo",
            header: this.header
        })

        this.log.info("Delete Method" + JSON.stringify(data));

        this.restService.post(deleterole, environment.deleteroles)
            .map((roles: any) => {
                let result: Array<Role> = [];
                if (Role instanceof Array) {
                    roles.forEach((erg) => {
                        this.log.info("Delete==="+erg);
                        result.push(new Role());

                    });
                    return result;
                } else {
                    this.log.info("===============" + roles.status.statusCode);
                    if (roles.status.statusCode == '1001') {
                        this.openSnackBar("Deleted Successfully", data.roleName);
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
