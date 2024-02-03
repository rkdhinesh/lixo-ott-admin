import { Component, OnInit } from '@angular/core';
import { Publish } from '../publish';
import { TempDataService } from '../../../shared/temp-dataStore';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublishShowRequest } from '../publishshowrequest';
import { PublishClassRequest } from '../publishclassrequest';
import { PublishClassSummaryRequest } from '../publishclasssummaryrequest';
import { PublishShowSummaryRequest } from '../publishshowsummaryrequest';
import { Header } from '../../../shared/services/header';
import { PublishResponse } from '../publishResponse';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { Headers } from '../../../shared/model/request-header';
import { RestService } from '../../../api.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-approve-publish',
  templateUrl: './approve-publish.component.html',
  styleUrls: ['./approve-publish.component.scss']
})
export class ApprovePublishComponent implements OnInit {
  dataSource;
  selectedData: Publish;
  constructor(private tempDataService: TempDataService, private restService: RestService,
    public snackBar: MatSnackBar, private datePipe: DatePipe, private log: LogService) { }
  publishShowRequest: PublishShowRequest;
  publishShowPublishShowSummaryRequestPublishShowSummaryRequest;
  publishClassRequest: PublishClassRequest;
  publishClassSummeryRequest: PublishClassSummaryRequest;

  publishShowRequestArr: Array<PublishShowRequest> = [];
  publishShowSummeryRequestArr: Array<PublishShowSummaryRequest> = [];
  publishClassRequestArr: Array<PublishClassRequest> = [];
  publishClassSummeryRequestArr: Array<PublishClassSummaryRequest> = [];
  headers: Headers;
  header: Header;
  responseData: PublishResponse;
  isSuccess: boolean = true;





  loadDefaultValues() {

    let publishValue = <Publish>({
      bookingOpeningDate: '',
      classSummaryPublished: this.publishClassSummeryRequestArr,
      companyId: 0,
      fromDate: '',
      screenId: 0,
      showSummaryPublished: this.publishShowSummeryRequestArr,
      showsCanceled: 0,
      showsPublished: this.publishShowRequestArr,
      toDate: '',
      venueId: 0
    });
    this.selectedData = publishValue;
  }
  ngOnInit() {

    this.headers = <Headers>{
      header: this.header
    }

    this.loadDefaultValues();
    this.tempDataService.currentSelectedData.subscribe(selectedData => this.selectedData = selectedData);
    let b = 0;
    let c = 0;
  }


  displayedColumns = ['bookingOpeningDate', 'showDate', 'showTime', 'movie', 'className', 'baseFare', 'extraFare', 'discount', 'taxes', 'totalFare'];

  /* Save Details**/
  public saveDetail() {
    this.selectedData.header = this.header;
    if (this.selectedData.bookingOpeningDate != null) {
      this.selectedData.bookingOpeningDate = this.datePipe.transform(this.selectedData.bookingOpeningDate, "dd-MMM-yyyy");

    }

    if (this.selectedData.fromDate != null) {
      this.selectedData.fromDate = this.datePipe.transform(this.selectedData.fromDate, "dd-MM-yyyy");

    }
    if (this.selectedData.toDate != null) {
      this.selectedData.toDate = this.datePipe.transform(this.selectedData.toDate, "dd-MMM-yyyy");

    }

    if (this.selectedData.showsPublished.map(dateObj => {
      dateObj.bookingOpeningDate = this.datePipe.transform(dateObj.bookingOpeningDate, "dd-MMM-yyyy");
      dateObj.showDate = this.datePipe.transform(dateObj.showDate, "dd-MMM-yyyy");
    }) != null) {
      this.selectedData.toDate = this.datePipe.transform(this.selectedData.toDate, "dd-MMM-yyyy");

    }

    debugger
    this.restService.post(this.selectedData, environment.savePublishData)
      .map((publish: any) => {
        let result: PublishResponse;
        result = new PublishResponse(publish.status["statusCode"], publish.status["statusDescription"], publish.status["transactionId"]);
        return result;

      })
      .subscribe(result => {
        this.log.info("inside response" + result.statusCode + "" + result.statusDescription + "" + result.transactionId);
        this.responseData = result;
        this.log.info(this.responseData);
        if (this.responseData.statusCode = '1002') {
          this.isSuccess = true;
          this.log.info("--------------" + this.isSuccess)
          this.openSnackBar("Successfully Saved", "success");
          this.log.info("--------------" + this.responseData.statusCode);
          this.ngOnInit();
        } else if (this.responseData.statusCode = '4001') {
          this.openSnackBar(this.responseData.statusDescription, "error");
        }

      })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}