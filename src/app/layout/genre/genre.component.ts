import { Component, OnInit, ViewChild } from '@angular/core';
import { Genre } from './genre';
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
import { environment } from '../../../environments/environment';
import { LogService } from '../../shared/services/log.service';
import { Header } from '../../shared/services/header';
import { ScreenAccessService } from '../../shared/services/screen-access.service';


@Component({
    selector: 'app-genre',
    templateUrl: './genre.component.html',
    styleUrls: ['./genre.component.scss']
})
export class GenreComponent implements OnInit {

    //Property Declaration
    headers: Headers;
    header = new Header(UUID.UUID());
    noContent: boolean = false;
    operationAccessMap = new Map();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: any;
    displayedColumns: string[] = ['genreName', 'description', 'action'];
    deletedialogRef: any;
    isLoading: boolean = true;
    isContent: boolean = false;


    //Dependency Injection
    constructor(
        private restService: RestService,
        public dialog: MatDialog,
        public router: Router,
        public tempDataService: TempDataService,
        private screenAccess: ScreenAccessService,
        public snackBar: MatSnackBar) { }

    ngOnInit() {
        this.screenAccess.loadOperationsAccessForScreen('Movie Management', 'Genre');
        this.operationAccessMap = this.screenAccess.map;
        this.getAllGenreDetail();   //call getAllGenreDetail() method to get already existing genre details
    }

    //Send selected genre detail
    editdata(data: any) {
        this.tempDataService.changeSelecedData(data);
    }

    //Delete clicked genre detail
    delete(uniqueaccountType) {
        this.deletedialogRef = this.dialog.open(YesOrNoDialogComponent, {
            disableClose: true
        });
        this.deletedialogRef.afterClosed().subscribe(result => {
            if (result === true) {
                this.deleteDetail(uniqueaccountType);
            } else {

            }
        });
        this.deletedialogRef.componentInstance.modal_name = "DELETE ACCOUNT"
    }

    private deleteDetail(data: any) {
        // Delete clicked genre by Id
        let deleteGenre = <Genre>({
            genreId: data.genreId,
            header: this.header
        })
        this.restService.delete(environment.deleteGenrePath + deleteGenre.genreId)
            .map((response: any) => {            // get response from the end-point called
                let result: Array<Genre> = [];
                if (response.statusCode == 201) {  // Sucessful Delete
                    this.openSnackBar(response.statusDescription, 'success-genre-snackbar', 'delete')      // show successful Deleted msg
                } else {
                }
            })
            .subscribe();
    }

    private getAllGenreDetail(): any {
        // Gets genre details from api end-point
        let result: Array<Genre> = [];
        this.restService.get(environment.getAllGenrePath)
            .map((response: any) => {            // get data or response from the end-point called
                let result: Array<Genre> = [];
                if (response.statusCode == 201) {     // successful get
                    response.data.forEach(erg => {
                        let obj = new Genre(erg.genreId, erg.genreName, erg.description);
                        result.push(obj);
                    });
                    this.openSnackBar(response.statusDescription, 'success-genre-snackbar')  // show successful received msg
                    this.isContent = true;
                }
                else if (response.statusCode == 204) {
                    this.noContent = true;
                }       //204 - no content
                return result;
            })
            .subscribe((result) => {
                this.dataSource = new MatTableDataSource(result);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            },
                () => {
                    this.isLoading = false;
                })
    }

    openSnackBar(message: string, style?: string, deleteGenre?: string) {  // msg panel
        this.snackBar.open(message, '', {
            duration: 2000,           // show msg for 2 sec.
            panelClass: style
        });
        if (deleteGenre) {
            setTimeout(() => {
                this.ngOnInit();
            }, 2000)           // route after 2 sec msg
        }
    }
}