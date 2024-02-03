import { Component, OnInit, ViewChild } from '@angular/core';
import { Movie } from './movie';
import { Headers } from '../../shared/model/request-header';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RestService } from '../../api.service';
import { Router } from '@angular/router';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { UUID } from '../../shared/services/uuid';
import { TempDataService } from '../../shared/temp-dataStore';
import { Genre } from '../genre/genre';
import { environment } from '../../../environments/environment';
import { LogService } from '../../shared/services/log.service';
import { Header } from '../../shared/services/header';
import { ScreenAccessService } from '../../shared/services/screen-access.service';
import { MovieDetail } from './movie-detail';
import { Fare } from '../fare/fare';
import { MovieDetailService } from './movie-detail.service';

@Component({
    selector: 'app-movie',
    templateUrl: './movie.component.html',
    styleUrls: ['./movie.component.scss']
})
export class MovieComponent implements OnInit {

    //Property Declaration
    operationAccessMap = new Map();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    dataSource: any;
    displayedColumns: string[] = ['movieName', 'duration', 'quality', 'cost', 'language', 'detail', 'action'];
    deletedialogRef: any;
    noContent: boolean;
    isMovieDeleted: boolean = false;
    isMovieDetailDeleted: boolean = false;
    isLoading: boolean = true;
    isContent: boolean = false;

    //Dependency Injection
    constructor(
        private restService: RestService,
        public dialog: MatDialog,
        public router: Router,
        public tempDataService: TempDataService,
        private screenAccess: ScreenAccessService,
        public snackBar: MatSnackBar,
        private movieDetailService: MovieDetailService) { }

    ngOnInit() {
        this.screenAccess.loadOperationsAccessForScreen('Movie Management', 'Movie');
        this.operationAccessMap = this.screenAccess.map;
        this.getAllMovieDetail();   //call getAllMovieDetail() method to get movie, moviedetail, fare, genre of already existing each movie
    }

    //Send selected movie detail
    editdata(data: any) {
        this.tempDataService.changeSelecedData(data);
    }

    editMovieDetail(data: any) {
        this.movieDetailService.receiveCurrentUrl(this.router.url) // send current Url
        this.movieDetailService.toViewMovieDetail(data);  // call movie detail service
    }

    //Delete clicked movie and movie detail
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
        // Delete clicked movie by Id
        this.restService.delete(environment.deleteMoviePath + data.movie.movieId)
            .map((response: any) => {            // get response from the end-point called
                let result: Array<Movie> = [];
                if (response.statusCode == 201) {  // Sucessful Delete
                    this.isMovieDeleted = true
                    this.openSnackBar(response.statusDescription, 'success-movie-snackbar', 'delete')      // show successful Deleted msg
                } else {
                }
            })
            .subscribe(
        );
        // Delete clicked movie detail by Id
        this.restService.delete(environment.deleteMovieDetailPath + data.movieDetails.movieId)
            .map((response: any) => {            // get response from the end-point called
                let result: Array<Movie> = [];
                if (response.statusCode == 201) {  // Sucessful Delete
                    this.isMovieDetailDeleted = true
                    this.openSnackBar(response.statusDescription, 'success-movie-detail-snackbar', 'delete')      // show successful Deleted msg
                } else {
                }
            })
            .subscribe(
        );
        if( this.isMovieDeleted && this.isMovieDetailDeleted) {
            this.openSnackBar('Movie and Movie Detail Deleted Successfully', 'both-success-movie-snackbar', 'delete')
        }
        else if(this.isMovieDeleted) {
            this.openSnackBar('Movie Deleted Successfully and Movie Detail Deletion Failed', 'movie-success-movie-snackbar', 'delete')
        }
        else if(this.isMovieDetailDeleted) {
            this.openSnackBar('Movie Detail Deleted Successfully and Movie Deletion Failed', 'movie-detail-success-movie-snackbar', 'delete')
        }
        else {
            this.openSnackBar('Both Movie and Movie Detail Deletion Failed', 'both-failure-movie-snackbar', 'delete')
        }
    }

    private getAllMovieDetail(): any {
        // Gets movie, movie detail, fare, genre of each movie from api end-point
        this.restService.get(environment.getAllMoviePath)
            .map((response: any) => {            // get data or response from the end-point called
                let result: any[] = [];
                if (response.statusCode == 201) {     // successful get
                    response.data.forEach(movieData => {
                        let movieObj = new Movie(movieData.movie.movieId, movieData.movie.movieName, movieData.movie.quality, movieData.movie.genreId,
                            movieData.movie.fareId, movieData.movie.yearReleased, movieData.movie.duration, movieData.movie.availableFrom, movieData.movie.availableTo,
                            movieData.movie.upcomingMovie, movieData.movie.rating, movieData.movie.thumbnailUrl, movieData.movie.previewUrl,
                            movieData.movie.movieUrl, movieData.movie.addedBy, movieData.movie.addedOn, movieData.movie.censorRating, movieData.movie.securityToken);
                        let movieDetailObj = new MovieDetail(movieData.movieDetails.movieId, movieData.movieDetails.movieName,
                            movieData.movieDetails.language, movieData.movieDetails.subtitles, movieData.movieDetails.directors, movieData.movieDetails.producers,
                            movieData.movieDetails.studio, movieData.movieDetails.starCast, movieData.movieDetails.synopsis);
                        let movieFareObj = new Fare(movieData.fare.fareId, movieData.fare.amount, movieData.fare.tax, movieData.fare.totalAmount,
                            movieData.taxIds);
                        let movieGenreObj = new Genre(movieData.genre.genreId, movieData.genre.genreName, movieData.genre.description)
                        let combinedObj = {
                            movie: movieObj,
                            movieDetails: movieDetailObj,
                            movieFare: movieFareObj,
                            movieGenre: movieGenreObj
                        };
                        result.push(combinedObj);
                    });
                    this.openSnackBar(response.statusDescription, 'success-movie-snackbar');  // show successful received msg
                    this.isContent = true;
                }
                else if (response.statusCode == 204) {  // no Content
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

    openSnackBar(message: string, style: string, deleteMovie?: string) {  // msg panel
        this.snackBar.open(message, '', {
            duration: 2000,           // show msg for 2 sec.
            panelClass: style
        });
        if (deleteMovie) {
            setTimeout(() => {
                this.ngOnInit();
            }, 2000)           // route after 2 sec msg
        }
    }
}