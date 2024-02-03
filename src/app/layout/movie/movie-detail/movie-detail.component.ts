import { Component, OnInit, ViewChild } from '@angular/core';
import { Movie } from '../movie';
import { Headers } from '../../../shared/model/request-header';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RestService } from '../../../api.service';
import { Router } from '@angular/router';
import { YesOrNoDialogComponent } from '../../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { UUID } from '../../../shared/services/uuid';
import { TempDataService } from '../../../shared/temp-dataStore';
import { Genre } from '../../genre/genre';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';
import { ScreenAccessService } from '../../../shared/services/screen-access.service';
import { MovieDetail } from '../movie-detail';
import { MovieDetailService } from '../movie-detail.service';

@Component({
    selector: 'app-movie-detail',
    templateUrl: './movie-detail.component.html',
    styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {

    //Property Declaration
    operationAccessMap = new Map();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: any;
    displayedColumns: string[] = ['movieName', 'language', 'subtitle', 'director', 'producer', 'action'];
    deletedialogRef: any;
    noContent: boolean;
    isLoading: boolean = true;
    isContent: boolean = false;

    //Dependency Injection
    constructor(
        private restService: RestService,
        public dialog: MatDialog,
        public router: Router,
        public tempDataService: TempDataService,
        public snackBar: MatSnackBar,
        private movieDetailService: MovieDetailService) { }

    ngOnInit(): void {
        // this.screenAccess.loadOperationsAccessForScreen('Movie Management', 'Movie');
        // this.operationAccessMap = this.screenAccess.map;
        this.getAllMovieDetail();  //call getAllMovieDetail() method to get all exist movie details
    }

    //Send selected movie detail
    editdata(data: MovieDetail) {
        this.movieDetailService.receiveCurrentUrl(this.router.url) //send current Url
        this.movieDetailService.toViewMovieDetail(data); //call movie detail service
    }

    //Delete clicked movie detail
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
        // Delete clicked movie detail by Id
        this.restService.delete(environment.deleteMovieDetailPath + data.movieId)
            .map((response: any) => {            // get response from the end-point called
                let result: Array<Movie> = [];
                if (response.statusCode == 201) {  // Sucessful Delete
                    this.openSnackBar(response.statusDescription, 'success-movie-detail-snackbar', 'delete')      // show successful Deleted msg
                } else {
                }
            })
            .subscribe(
        );
    }

    private getAllMovieDetail(): any {
        // Get all exist movie details from api end-point
        this.restService.get(environment.getAllMovieDetailPath)
            .map((response: any) => {            // get data or response from the end-point called
                let result: MovieDetail[] = [];
                if (response.statusCode == 201) {  // Sucessful retrieval
                    response.data.forEach(movie => {
                        let obj = new MovieDetail(movie.movieId, movie.movieName, movie.language, movie.subtitles, movie.directors,
                            movie.producers, movie.studio, movie.starCast, movie.synopsis);
                        result.push(obj);
                    });
                    this.openSnackBar(response.statusDescription, 'success-movie-detail-snackbar')      // show successful received msg
                    this.isContent = true;
                }
                else if (response.statusCode == 204) { // no Content
                    this.noContent = true;
                }
                return result;
            })
            .subscribe(result => {
                this.dataSource = new MatTableDataSource(result);
                this.dataSource.sort = this.sort;
                this.dataSource.paginator = this.paginator;
            },
            () => {
                this.isLoading = false;
            })
    }

    openSnackBar(message: string, style: string, deleteMovieDetail?: string) {     // msg panel
        this.snackBar.open(message, '', {
            duration: 2000,           // show msg for 2 sec.
            panelClass: style
        });
        if (deleteMovieDetail) {
            setTimeout(() => {
                this.ngOnInit();
            }, 2000)           // update list after 2 sec msg
        }
    }

}
