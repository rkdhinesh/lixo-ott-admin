import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../api.service';
import { Header } from '../../shared/services/header';
import { UUID } from '../../shared/services/uuid';
import { User } from '../../shared/model/user';
import { UserRole } from '../../shared/model/user-role';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { LogService } from '../../shared/services/log.service';
import { TempDataService } from '../../shared/temp-dataStore';
import { environment } from '../../../environments/environment';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';

export class UserRoleRequestHeader {
    header: Header;
    constructor() { }
}

@Component({
    selector: 'app-user-role',
    templateUrl: './user-role.component.html',
    styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {
    dialogRef;
    deletedialogRef;
    ioObjArray: UserRole[] = [];
    selectedData: UserRole;
    userLists: User[] = [];
    data: any;
    userRoles: any;
    headers: Headers;
    header = new Header(UUID.UUID());
    errorMessage: string = '';
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: any;
    displayedColumns = ['user', 'role', 'action'];

    constructor(public router: Router, private restService: RestService,
        private log: LogService, public tempDataService: TempDataService, public snackBar: MatSnackBar, public dialog: MatDialog) { }

    ngOnInit() {
        this.getAllUserInformations();
    }

    private getAllUserInformations() {
        let header = new Header(UUID.UUID());
        let userRoleRequest = <UserRoleRequestHeader>({});
        userRoleRequest.header = header;
        this.restService.post(userRoleRequest, environment.fetchAllUserRolePath)
            .map((response: any) => {
                let result: Array<User> = [];
                if (response) {
                    response.users.forEach(erg => {

                        let user = new User();
                        user.userId = erg.userId;
                        let userRoles: Array<UserRole> = [];

                        erg.userRoles.forEach(obj => {
                            let userRole = new UserRole();
                            userRole.userId = obj.userId;
                            localStorage.setItem("userId", JSON.stringify(userRole.userId));
                            userRole.roleId = obj.roleId;
                            userRole.roleName = obj.roleName;
                            userRole.userRoleId = obj.userRoleId;
                            userRole.client = obj.client;
                            userRole.system = obj.system;
                            userRoles.push(userRole);
                        });
                        user.roles = userRoles;

                        result.push(user);
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

    selectRole(userRole: UserRole) {
        this.log.info(JSON.stringify(userRole));
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
        for (let role of data.roles) {
            this.userRoles = role;
        }
        let header = new Header(UUID.UUID());
        this.userRoles.header = header;
        this.log.info("Delete Method" + JSON.stringify(data));

        this.restService.post(this.userRoles, environment.deleteuserrole)
            .map((userroles: any) => {
                let result: Array<UserRole> = [];
                if (UserRole instanceof Array) {
                    userroles.forEach((erg) => {
                        this.log.info("Delete==="+erg);
                        result.push(new UserRole());

                    });
                    return result;
                } else {
                    this.log.info("===============" + userroles.status.statusCode);
                    if (userroles.status.statusCode == '1001') {
                        this.openSnackBar("Deleted Successfully", data.userId);
                        this.ngOnInit();
                        this.log.info("--------------" + userroles.status.statusCode);
                    } else if (userroles.status.statusCode == '1002') {
                        this.openSnackBar(userroles.status.statusDescription, data.userId);
                    } else {
                        this.openSnackBar(userroles.status.statusDescription, "error");
                    }
                }

            })
            .subscribe(userRoles => this.ioObjArray = userRoles);

    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
    editdata(data: any) {
        this.tempDataService.changeSelecedData(data);
        return true;

    }
}
