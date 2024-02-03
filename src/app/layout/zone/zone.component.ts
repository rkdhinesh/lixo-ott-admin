import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RestService } from '../../api.service';
import { Router } from '@angular/router';
import { TempDataService } from '../../shared/temp-dataStore';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { Zone } from './zone';
import { UUID } from '../../shared/services/uuid';
import { Headers } from '../../shared/model/request-header';
import { Header } from '../../shared/services/header';
import { ScreenAccessService } from '../../shared/services/screen-access.service';
import { LogService } from '../..//shared/services/log.service';
import { environment } from '../../../environments/environment';
import { ConfirmDialogComponent } from './ConfirmDialog/ConfirmDialogComponent';


@Component({
    selector: 'app-zone',
    templateUrl: './zone.component.html',
    styleUrls: ['./zone.component.scss']
})
export class ZoneComponent implements OnInit {

    ioObjArray: Zone[] = [];
    isLoading: boolean = true;
    data: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: any;
    displayedColumns: string[] = ['zoneId', 'zoneName', 'action'];
    operationAccessMap = new Map();
    dialogRef;
    deletedialogRef;
    confirmRef;
    confirmdialogRef;
    header = new Header(UUID.UUID());
    headers: Headers;



    constructor(private restService: RestService, public dialog: MatDialog, public router: Router,
        private screenAccess: ScreenAccessService,
        public tempDataService: TempDataService, public snackBar: MatSnackBar, private log: LogService) { }

    /* On load pagenation Event*/
    ngOnInit() {

        this.headers = <Headers>{
            header: this.header
        }

        this.screenAccess.loadOperationsAccessForScreen('Zone Management', 'Zone');
        this.operationAccessMap = this.screenAccess.map;
        this.getAllDetail();
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
    /* Edit Details **/
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

        });
        this.deletedialogRef.afterClosed().subscribe(result => {
            this.log.info("after closed:result");
            this.log.info(result);
            if (result === true) {
                this.deleteDetail(uniqueaccountType);
            } else {

            }
        });
        this.deletedialogRef.componentInstance.modal_name = "DELETE ACCOUNT"
    }

    private deleteDetail(data: any) {
        let deleteZone = <Zone>({
            zoneId: data.zoneId,
            header: this.header
        })
        // data.header=this.headervalue;
        this.log.info("Delete Method" + JSON.stringify(data));

        this.restService.post(deleteZone, environment.deleteZonePath)
            .map((zones: any) => {
                let result: Array<Zone> = [];
                if (Zone instanceof Array) {
                    zones.forEach((erg) => {
                        this.log.info("Delete===");
                        result.push(new Zone(erg.zoneId, erg.zoneName));

                    });
                    return result;
                } else {
                    this.log.info("===============" + zones.status.statusCode);
                    if (zones.status.statusCode == '1001') {
                        this.openSnackBar("Deleted Successfully", data.zoneName);
                        this.getAllDetail();
                        this.log.info("--------------" + zones.status.statusCode);

                    } else if (zones.status.statusCode == '1002') {
                        this.openSnackBar("Deleted Failed", data.zoneName);
                    }
                }

            })
            .subscribe(zones => this.ioObjArray = zones);
    }

    /**Setup New Zone**/

    confirm(uniqueaccountType) {

        this.tempDataService.changeSelecedData(uniqueaccountType);
        this.confirmdialogRef = this.dialog.open(ConfirmDialogComponent, {

        });
        this.confirmdialogRef.afterClosed().subscribe(result => {
            this.log.info("after closed:result");
            this.log.info(result);
            if (result === true) {
                this.confirmDetail(uniqueaccountType);
            } else {

            }
        });
        this.confirmdialogRef.componentInstance.modal_name = "New Zone Setup"
    }

    private confirmDetail(data: any) {
        let setupZone = <Zone>({
            zoneId: data.zoneId,
            header: this.header
        })
        // data.header=this.headervalue;
        this.log.info("Zone Setup" + JSON.stringify(data));

        this.restService.post(setupZone, environment.newzonePath)
            .map((zones: any) => {
                let result: Array<Zone> = [];
                if (Zone instanceof Array) {
                    zones.forEach((erg) => {
                        this.log.info("Setup New Zone===");
                        result.push(new Zone(erg.zoneId, erg.zoneName));

                    });
                    return result;
                } else {
                    this.log.info("===============" + zones.status.statusCode);
                    if (zones.status.statusCode == '1001') {
                        this.openSnackBar("Zone setup done Successfully", data.zoneName);

                        this.getAllDetail();
                        this.log.info("--------------" + zones.status.statusCode);

                    } else if (zones.status.statusCode == '1002') {
                        this.openSnackBar("Zone setup done Failed", data.zoneName);
                    } else if (zones.status.statusCode == '1004') {
                        this.openSnackBar("Zone setup already exit", data.zoneName);
                    }
                }

            })
            .subscribe(zones => this.ioObjArray = zones);
    }
    /* Get ALL Details**/
    private getAllDetail() {
        this.restService.post(this.headers, environment.getAllZonePath)
            .map((response: any) => {
                let result: Array<Zone> = [];
                if (response) {
                    response.zones.forEach(erg => {
                        let obj = new Zone(erg.zoneId, erg.zoneName);
                        obj.status = erg.setupStatus;

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

    /*Get Single Detail **/

    public getParticularDetail() {
        this.restService.post(this.data, environment.getAllZonePath)
            .map((allZones: Array<any>) => {

                let result: Array<Zone> = [];
                if (allZones) {
                    this.isLoading = false;
                    let zonesArray = allZones["zones"];
                    //let resource = resources[0];
                    //this.log.info(resource["zoneId"]);
                    zonesArray.forEach((erg) => {
                        this.ioObjArray = erg;
                        result.push(new Zone(erg.zoneId, erg.zoneName));

                    });
                }
                //this.totalItems = result;
                return result;
            })
            .subscribe(result => { 

            })
    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}

