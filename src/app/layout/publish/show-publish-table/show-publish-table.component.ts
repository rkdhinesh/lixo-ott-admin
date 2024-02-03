import { Component, OnInit } from '@angular/core';
import { TempDataService } from '../../../shared/temp-dataStore';
import { Publish } from '../publish';
import { PublishShowRequest } from '../publishshowrequest';
import { PublishShowSummaryRequest } from '../publishshowsummaryrequest';
import { PublishClassRequest } from '../publishclassrequest';
import { PublishClassSummaryRequest } from '../publishclasssummaryrequest';
import { UUID } from '../../../shared/services/uuid';
import { Headers } from '../../../shared/model/request-header';
import { MatSnackBar} from '@angular/material/snack-bar';
import { PublishResponse } from '../publishResponse';
import { DatePipe } from '@angular/common';
import { RestService } from '../../../api.service';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-show-publish-table',
  templateUrl: './show-publish-table.component.html',
  styleUrls: ['./show-publish-table.component.scss']
})
export class ShowPublishTableComponent implements OnInit {
  dataSource;
  selectedData: Publish;
  constructor(private tempDataService: TempDataService, private restService: RestService,
    private datePipe: DatePipe, private log: LogService,
    public snackBar: MatSnackBar) {

  } publishShowRequest: PublishShowRequest;
  publishShowPublishShowSummaryRequestPublishShowSummaryRequest;
  publishClassRequest: PublishClassRequest;
  publishClassSummeryRequest: PublishClassSummaryRequest;

  publishShowRequestArr: Array<PublishShowRequest> = [];
  publishShowSummeryRequestArr: Array<PublishShowSummaryRequest> = [];
  publishClassRequestArr: Array<PublishClassRequest> = [];
  publishClassSummeryRequestArr: Array<PublishClassSummaryRequest> = [];
  headers: Headers;
  header = new Header(UUID.UUID());
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

  }


  displayedColumns = ['bookingOpeningDate', 'showDate', 'showTime', 'movie', 'className', 'baseFare', 'extraFare', 'discount', 'taxes', 'totalFare'];


  public saveDetail() {
    this.selectedData.header = this.header;
    if (this.selectedData.bookingOpeningDate != null) {
      this.selectedData.bookingOpeningDate = this.datePipe.transform(this.selectedData.bookingOpeningDate, "dd-MM-yyyy");

    }

    if (this.selectedData.fromDate != null) {
      this.selectedData.fromDate = this.datePipe.transform(this.selectedData.fromDate, "dd-MM-yyyy");

    }
    if (this.selectedData.toDate != null) {
      this.selectedData.toDate = this.datePipe.transform(this.selectedData.toDate, "dd-MM-yyyy");

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
          //this.getAllDetail();
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
