import { Component, OnInit } from '@angular/core';
import { MatSnackBar,  } from '@angular/material/snack-bar';
import {  MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Header } from '../../../../shared/services/header';
import { CineastMemberResponse } from '../../../../layout/cineast-member/cineast-memberResponse';
import { UUID } from '../../../../shared/services/uuid';
import { RestService } from '../../../../api.service';
import { LogService } from '../../../../shared/services/log.service';
import { TempDataService } from '../../../../shared/temp-dataStore';
import { environment } from '../../../../../environments/environment';
import { Headers } from '../../../../shared/model/headers';

export class EditReviewRequest {
  header = new Header(UUID.UUID());
  comments: string;
  criticName: string;
  rating: number;
  reviewId: number;
  title: string;
  userId: string;
  constructor() { }
}

@Component({
  selector: 'app-edit-critic-review',
  templateUrl: './edit-critic-review.component.html',
  styleUrls: ['./edit-critic-review.component.scss']
})
export class EditCriticReviewComponent implements OnInit {
  criticMovieId: number;
  headers: Headers;
  selectedData: EditReviewRequest;
  header = new Header(UUID.UUID());
  getUserId: string;
  responseData: CineastMemberResponse;
  isSuccess = true;
  error: string;

  constructor(private tempDataService: TempDataService,
    private restService: RestService,
    private log: LogService,
    public snackBar: MatSnackBar,
    private router: Router,

    public dialogRef: MatDialogRef<EditCriticReviewComponent>,) { }

  clear() {
    const EditCriticReview = <EditReviewRequest>{
      reviewId: 0,
      criticName: '',
      title: '',
      rating: 0,
      comments: '',
      userId: ''
    };
    this.selectedData = EditCriticReview;
  }

  ngOnInit() {
    this.headers = <Headers>{
      header: this.header
    };
    this.log.info('EDIT METHOD');
    this.tempDataService.currentSelectedData.subscribe(
      selectedData => (this.selectedData = selectedData)
    );
  }

  public save() {
    this.log.info('Edit save method');
    this.editCriticReview();
    this.router.navigate(['/movie']);
  }

  private editCriticReview() {
    const request = <EditReviewRequest
      >{};
    request.header = this.header;
    request.reviewId = this.selectedData.reviewId;
    request.criticName = this.selectedData.criticName;
    request.title = this.selectedData.title;
    request.rating = this.selectedData.rating;
    request.comments = this.selectedData.comments;
    this.getUserId = localStorage.getItem('userId');
    request.userId = this.getUserId;
    this.restService
      .post(request, environment.editCriticReview)
      .map((critic: any) => {
        let result: CineastMemberResponse;
        result = new CineastMemberResponse(
          critic.status['statusCode'],
          critic.status['statusDescription'],
          critic.status['transactionId']
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
            this.openSnackBar(
              'Successfully updated',
              this.selectedData.criticName
            );
            this.onNoClick();
            this.router.navigate(['/movie']);
            this.ngOnInit();
          } else if ((this.responseData.statusCode == '1002')) {
            this.openSnackBar(
              this.responseData.statusDescription,
              this.selectedData.criticName
            );
          }
        },
        err => {
          const errorVal = err.status.statusDescription;
          this.openSnackBar('Edit Review filed ', errorVal);
        }
      );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
}
