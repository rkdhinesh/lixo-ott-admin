import { Component, ElementRef, ViewChild, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { Movie } from '../movie';
import { MovieResponse } from '../movieResponse';
import { Headers } from '../../../shared/model/request-header';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { UUID } from '../../../shared/services/uuid';
import { Genre } from '../../genre/genre';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { TempDataService } from '../../../shared/temp-dataStore';
import { Duration } from '../duration';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';
import { environment } from '../../../../environments/environment';
import { YesOrNoDialogComponent } from '../../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { ViewmodalComponent } from '../../../viewmodal/viewmodal.component';
import { CriticReviewComponent } from '../critic-review/critic-review.component';
import { FetchCriticReview } from '../critic-review/fetch-all-critic-review';
import { EditCriticReviewComponent } from '../critic-review/edit-critic-review/edit-critic-review.component';
import { MovieDetailService } from '../movie-detail.service';


export class CriticReviewHeader {
  header: Header;
  movieId: Number;
  constructor() { }
}

@Component({
  selector: 'app-view-movie',
  templateUrl: './view-movie.component.html',
  styleUrls: ['./view-movie.component.scss']
})
export class ViewMovieComponent implements OnInit {

  //property declaration
  selectedData: any;

  //dependency injection
  constructor(
    private tempDataService: TempDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private movieDetailService: MovieDetailService,
    private router: Router) { }

  ngOnInit() {
    this.tempDataService.currentSelectedData.subscribe(    // get Selected movie data here
      (selectedData) => this.selectedData = selectedData);
  }

  sendMovieDetail() {
    this.movieDetailService.index = this.selectedData.movie.movieId;
    this.movieDetailService.toViewMovieDetail(this.selectedData.movieDetails)
    this.router.navigate(['/view-movie-detail'])
    console.log(this.selectedData.movieDetails);
  }

}





