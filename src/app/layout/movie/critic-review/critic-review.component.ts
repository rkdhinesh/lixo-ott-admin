import { Component, OnInit } from '@angular/core';
import { AddCriticReviewResponse } from './add-critic-review-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { RestService } from '../../../api.service';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';
import { UUID } from '../../../shared/services/uuid';
import { CineastMemberResponse } from '../../cineast-member/cineast-memberResponse';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-critic-review',
  templateUrl: './critic-review.component.html',
  styleUrls: ['./critic-review.component.scss']
})

export class CriticReviewComponent implements OnInit {
  criticMovieId: number;
  selectedData: AddCriticReviewResponse;
  header = new Header(UUID.UUID());
  headers: Headers;
  getUserId: string;
  responseData: CineastMemberResponse;
  isSuccess = true;
  error: string;
  selected: number;
  constructor(
    private restService: RestService,
    private log: LogService,
    public snackBar: MatSnackBar,
    private router: Router,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<CriticReviewComponent>,
  ) { } 
  ngOnInit() {
    this.AddCirticValues()
  }
 
  AddCirticValues() {
    const criticReview = <AddCriticReviewResponse>{
      comments: '',
      criticName: '',
      movieId: 0,
      rating: 0,
      title: '',
      reviewDate: '',
      userId: '',
    };
    this.selectedData = criticReview;
  }
  addCriticReview() {
    this.error = this.validation();
    if (this.error === 'false') {
      this.save();
    } else {
      this.openSnackBar('Error: ', this.error);
    }
  }

  private save() {
    const request = <AddCriticReviewResponse>{};
    request.header = this.header;
    request.comments = this.selectedData.comments;
    request.criticName = this.selectedData.criticName;
    this.criticMovieId = JSON.parse(localStorage.getItem('movieId'));
    request.movieId = this.criticMovieId;
    request.rating = this.selectedData.rating;
    request.title = this.selectedData.title;
    const todaysDate = new Date();
    const currentDate = this.datePipe.transform(todaysDate, "dd-MMM-yyyy");
    request.reviewDate = currentDate;
    this.getUserId = localStorage.getItem('userId');
    request.userId = this.getUserId;
    this.restService
      .post(request, environment.addCriticReview)
      .map((movie: any) => {
        let result: CineastMemberResponse;
        result = new CineastMemberResponse(
          movie.status['statusCode'],
          movie.status['statusDescription'],
          movie.status['transactionId']
        );
        return result;
      })
      .subscribe(
        result => {
          this.log.info(
            'inside response' +
            result.statusCode +
            '' +
            result.statusDescription +
            '' +
            result.transactionId
          );
          this.responseData = result;
          this.log.info(this.responseData);
          if ((this.responseData.statusCode == '1001')) {
            this.isSuccess = true;
            this.openSnackBar(
              'Successfully Saved',
              this.selectedData.title
            );
            this.onNoClick();
            this.router.navigate(['/movie']);
            this.ngOnInit();
          } else if ((this.responseData.statusCode == '1002')) {
            this.isSuccess = true;
            this.openSnackBar(
              'Failed to Add Critic Review',
              this.selectedData.title
            );
          }
        },
        err => {
          const errorVal = err.status.statusDescription;
          this.openSnackBar('Failed to add critic review', errorVal);
        }
      );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  validation() {
    if (this.selectedData.comments === '') {
      return 'Comments is required!';
    } else if (this.selectedData.criticName === '') {
      return 'Critic Name is required!';
    } else if (this.selectedData.title === '') {
      return 'Title is required!';
    }
    else {
      return 'false';
    }
  }

}
