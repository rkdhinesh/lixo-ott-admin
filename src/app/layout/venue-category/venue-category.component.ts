import { Component, OnInit, ViewChild } from '@angular/core';
import { VenueCategory } from './venue-category';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { RestService } from '../../api.service';
import { Router } from '@angular/router';
import { TempDataService } from '../../shared/temp-dataStore';
import { UUID } from '../../shared/services/uuid';
import { Headers } from '../../shared/model/request-header';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { environment } from '../../../environments/environment';
import { LogService } from '../../shared/services/log.service';
import { Header } from '../../shared/services/header';
import { ScreenAccessService } from '../../shared/services/screen-access.service';

@Component({
    selector: 'app-venue-category',
    templateUrl: './venue-category.component.html',
    styleUrls: ['./venue-category.component.scss']
})
export class VenueCategoryComponent implements OnInit {


    ioObjArray: VenueCategory[] = [];
    selectedData: VenueCategory;
    headers: Headers;
    header = new Header(UUID.UUID());
    errorMessage: string = '';
    data: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: any;
    displayedColumns: string[] = ['venueCategoryName', 'description', 'action'];

    color = 'primary';
    mode = 'determinate';
    FormObj;
    pageEvent: PageEvent;
    dialogRef;
    deletedialogRef;
    operationAccessMap = new Map();

    constructor(private restService: RestService, private log: LogService,
        public dialog: MatDialog, public router: Router, public snackBar: MatSnackBar,
        public tempDataService: TempDataService, private screenAccess: ScreenAccessService) { }

    /* On load pagenation Event*/
    ngOnInit() {

        this.headers = <Headers>{
            header: this.header
        }
        this.screenAccess.loadOperationsAccessForScreen('Zone Management', 'Venue Category');
        this.operationAccessMap = this.screenAccess.map;
        this.getAllVenueCategoryDetail();
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
                this.openSnackBar("Successfully deleted", uniqueaccountType.venueCategoryName);
            }
        });
        this.deletedialogRef.componentInstance.modal_name = "DELETE ACCOUNT"
    }

    private deleteDetail(data: any) {


        let deleteVenueCategory = <VenueCategory>({
            venueCategoryId: data.venueCategoryId,
            header: this.header
        })
        // data.header=this.headervalue;
        this.log.info("Delete Method" + JSON.stringify(data));

        this.restService.post(deleteVenueCategory, environment.deleteVenueCategoryPath)
            .map((venueCategory: any) => {
                let result: Array<VenueCategory> = [];
                if (VenueCategory instanceof Array) {
                    venueCategory.forEach((erg) => {
                        this.log.info("Delete===");
                        result.push(new VenueCategory(erg.synopsis, erg.venueCategoryId, erg.venueCategoryName));

                    });
                    return result;
                } else {
                    this.log.info("===============" + venueCategory.status.statusCode);
                    if (venueCategory.status.statusCode == '1001') {
                        this.openSnackBar("Deleted Successfully", data.venueName);
                        this.getAllVenueCategoryDetail();
                        this.log.info("--------------" + venueCategory.status.statusCode);
                    } else if (venueCategory.status.statusCode == '1003') {
                        this.openSnackBar(venueCategory.status.statusDescri, data.venueCategoryName);
                    } else if (venueCategory.status.statusCode == '1004') {
                        this.openSnackBar("Data Constraint Error ", data.venueCategoryName);
                    } else {
                        this.openSnackBar("Error", venueCategory.status.statusDescri);
                    }
                }

            })
            .subscribe(venuecatogries => this.ioObjArray = venuecatogries);

    }

    /* Get Details**/
    private getAllVenueCategoryDetail(): any {
        this.restService.post(this.headers, environment.getAllVenueCategoryPath)
            .map((response: any) => {
                let result: Array<VenueCategory> = [];
                if (response) {
                    response.venueCategories.forEach(erg => {
                        let obj = new VenueCategory(erg.synopsis, erg.venueCategoryId, erg.venueCategoryName);
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