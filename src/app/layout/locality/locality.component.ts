import { Component, OnInit, ViewChild } from '@angular/core';
import { Locality } from './locality';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RestService } from '../../api.service';
import { Router } from '@angular/router';
import { TempDataService } from '../../shared/temp-dataStore';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { UUID } from '../../shared/services/uuid';
import { Headers } from '../../shared/model/request-header';
import { Zone } from '../zone/zone';
import { environment } from '../../../environments/environment';
import { LogService } from '../../shared/services/log.service';
import { ScreenAccessService } from '../../shared/services/screen-access.service';
import { Header } from '../../shared/services/header';

@Component({
    selector: 'app-locality',
    templateUrl: './locality.component.html',
    styleUrls: ['./locality.component.scss']
})
export class LocalityComponent implements OnInit {

    ioObjArray: Locality[] = [];
    selectedData: Locality;
    headers: Headers;
    header = new Header(UUID.UUID());
    isLoading: boolean = true;
    data: any;
    result: Zone[] = [];
    dialogRef;
    deletedialogRef;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: any;
    displayedColumns: string[] = ['locality', 'city', 'action'];
    operationAccessMap = new Map();

    constructor(private restService: RestService, public dialog: MatDialog,
        public router: Router, public tempDataService: TempDataService, private screenAccess: ScreenAccessService,
        public snackBar: MatSnackBar, private log: LogService) { }

    /* On load pagenation Event*/
    ngOnInit() {

        this.headers = <Headers>{
            header: this.header
        }
        this.screenAccess.loadOperationsAccessForScreen('Zone Management', 'Locality');
        this.operationAccessMap = this.screenAccess.map;
        
        
        console.log
        this.getZones();
        this.getAllDetail();


    }


    /* Edit Details **/
    editdata(data: any) {
        data.editable = false;
        this.getZoneName(data);
        this.tempDataService.changeSelecedData(data);
        return true;

    }

    /* view Details **/
    viewDetailsdata(data: any) {
        data.editable = true;
        this.getZoneName(data);
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
            } else {

            }
        });
        this.deletedialogRef.componentInstance.modal_name = "DELETE ACCOUNT"
    }

    private deleteDetail(Locality) {
        let localityId = Locality.locality_id;
        this.log.info("Deleted the localityId " + JSON.stringify(localityId));

        this.restService.delete(environment.deleteLocalityPath+localityId)
            .subscribe(res => {
                this.openSnackBar(Locality.Locality, "Delete Successfully");
                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';        
                this.router.navigate(['/locality']);        

              })
    }


    /* Get Details**/
    private getAllDetail(): any {
        this.restService.get(environment.getAllLocalityPath)
            .map((localities: Array<any>) => {

                let result: Array<Locality> = [];
                if (localities) {
                    this.isLoading = false;
                    let localityArray = localities;
                    localityArray.forEach((erg) => {
                        this.ioObjArray = erg;
                        result.push(new Locality(erg.city, erg.localityId, erg.locality_id, erg.locality_name,
                            erg.pin_code, erg.state, erg.country, erg.city, erg.land_mark, erg.iconImage, erg.popularCity));

                    });
                }
                return result;
            })
            .subscribe(result => {

                this.dataSource = new MatTableDataSource(result);
                console.log("locallllll" + (this.dataSource))
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            })
    }


    private getZones() {
        this.restService.post(this.headers, environment.getAllZonePath)
            .map((allZones: Array<any>) => {
                if (allZones) {
                    let zonesArray = allZones["zones"];
                    zonesArray.forEach((erg) => {
                        this.result.push(new Zone(erg.zoneId, erg.zoneName));
                    });
                }
                return this.result;
            })
            .subscribe(zones => {
                this.result = zones;

            })
    }
    /* Display zoneName using with zoneId */
    getZoneName(data) {
        this.result.map((zone: any) => {
            if (zone.zoneId == data.zoneId) {
                data.zones = zone;
            }
        })
    }
    openSnackBar(message: string, action: string) {
        this.snackBar.open(message, action, {
            duration: 2000,
        });
    }
}