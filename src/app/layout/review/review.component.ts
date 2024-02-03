import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TempDataService } from '../../shared/temp-dataStore';
import { Headers } from '../../shared/model/request-header';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { UUID } from '../../shared/services/uuid';
import { RestService } from '../../api.service';
import { Review } from './review';
import { Header } from '../../shared/services/header';
import { LogService } from '../../shared/services/log.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-review',
    templateUrl: './review.component.html',
    styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {

    ioObjArray: Review[] = [];
    selectedData: Review;
    headers: Headers;
    header = new Header(UUID.UUID());
    errorMessage: string = '';

    isDeleteValid: Boolean = false;
    isLoading: boolean = true;
    queryString: string = "";
    selectedOption: string;
    closeResult: string;
    data: any;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: any;
    displayedColumns: string[] = ['experienceId', 'experienceName', 'action'];

    /* Material design variables */
    value = 50;
    length = 0;
    pageSize = 10;
    pageSizeOptions = [1, 10, 25, 100];
    pageIndex = 0;
    items: Review[] = [];
    totalItems: Review[] = [];
    color = 'primary';
    mode = 'determinate';
    FormObj;
    pageEvent: PageEvent;
    dialogRef;
    deletedialogRef;




    constructor(private restService: RestService, public dialog: MatDialog,
        public router: Router, public tempDataService: TempDataService,
        public snackBar: MatSnackBar, private log: LogService) { }

    /* On load pagenation Event*/
    ngOnInit() {

        this.headers = <Headers>{
            header: this.header
        }
        this.getAllExperienceDetail();


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

    private deleteDetail(data: any) {


        let deleteReview = <Review>({
            experienceId: data.experienceId,
            header: this.header
        })
        // data.header=this.headervalue;
        this.log.info("Delete Method" + JSON.stringify(data));

        this.restService.post(deleteReview, environment.deleteExperiencePath)
            .map((reviewObj: any) => {
                let result: Array<Review> = [];
                if (reviewObj instanceof Array) {
                    reviewObj.forEach((erg) => {
                        this.log.info("Delete===");
                        result.push(new Review(erg.experienceId, erg.experienceName, erg.experienceDesc));

                    });
                    return result;
                } else {
                    this.log.info("===============" + reviewObj.status.statusCode);
                    if (reviewObj.status.statusCode == '1001') {
                        this.openSnackBar("Deleted Successfully", data.experienceName);
                        this.getAllExperienceDetail();
                        this.log.info("--------------" + reviewObj.status.statusCode);
                    } else if (reviewObj.status.statusCode == '1002') {
                        this.openSnackBar("Operation Failed", data.experienceName);
                    }
                }

            })
            .subscribe(venuecatogries => this.ioObjArray = venuecatogries);
    }



    /* Get Details**/
    private getAllExperienceDetail(): any {
        debugger
        this.restService.post(this.headers, environment.getAllExperiencePath)
            .map((response: any) => {
                let result: Array<Review> = [];
                if (response) {
                    response.experiences.forEach(erg => {
                        result.push(new Review(erg.experienceId, erg.experienceName, erg.experienceDesc));
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