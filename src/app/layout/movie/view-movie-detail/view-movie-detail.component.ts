import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
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
import { MovieDetail } from '../movie-detail';
import { MovieDetailService } from '../movie-detail.service';

@Component({
  selector: 'app-view-movie-detail',
  templateUrl: './view-movie-detail.component.html',
  styleUrls: ['./view-movie-detail.component.css']
})

export class ViewMovieDetailComponent implements OnInit {

  //property declaration
  selectedData: MovieDetail;
  data: any;
  routeUrl: string = '';

  //dependency injection
  constructor(
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private movieDetailService: MovieDetailService,
    public tempDataService: TempDataService,
    private router: Router) {
  }

  ngOnInit(): void {
    if (this.movieDetailService.getSelectedMovieDetail()) {     // get selected movie details here
      this.data = this.movieDetailService.getSelectedMovieDetail();
      if (this.data.movieDetails) {
        this.selectedData = this.data.movieDetails;
      } else {
        this.selectedData = this.data;
      }
    }
  }

  //click cancel route page
  goBack() {
    this.routeUrl = this.movieDetailService.getPreviousUrl();  // get previous route Url
    this.router.navigate([this.routeUrl]);
  }

}
