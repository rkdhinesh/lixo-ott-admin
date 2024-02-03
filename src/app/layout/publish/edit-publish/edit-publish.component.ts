import { Component, OnInit } from '@angular/core';
import { Publish } from '../publish';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TempDataService } from '../../../shared/temp-dataStore';
import { UUID } from '../../../shared/services/uuid';
import { RestService } from '../../../api.service';
import { DatePipe } from '@angular/common';
import { PublishModel } from '../publish-model';
import { PublishResponse } from '../publishResponse';
import { PublishRequestHeader, PublishDropDownModel } from '../add-publish/add-publish.component';
import { SeatStatusResponse } from './seat-status-response';
import { SeatRepresentation } from './seat-representation';
import { Class, Seat, SeatLayoutResponse, SelectedClass, SelectedSeatLayout } from './seat-layout-response';
import { HttpClient } from '@angular/common/http';
import { MatRadioChange } from '@angular/material/radio';
import { CompanyIdRequest } from '../publish.component';
import { SeatHeader } from '../../../shared/services/seatheader';
import { SeatStatusRequest } from '../../../shared/model/seat-selection-model';
import { ScreenModel } from '../../../shared/model/screen-model';
import { Header } from '../../../shared/services/header';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';
import { ScreenAccessService } from '../../../shared/services/screen-access.service';


export class PublishEditRequestHeader {
  header: Header;
  fromDate: string;
  toDate: string;
  screenId: number;
  venueId: number;
  constructor() {}
}
export class DropDownModel {
  id: number;
  name: any;
  constructor(id: number, name: any) {
    this.id = id;
    this.name = name;
  }
}
export class RequestHeader {
  header: Header;
  constructor() {}
}
export class EditShowsPublishedRequest {
  //bookingOpeningDate: string;
  classesPublished: EditPublishClassSummaryModel[] = [];
  showPublishedId: number;
  movieId: number;
  showCancelled: boolean;
  showDate: string;
  showTime: string;

  constructor() {}
}


export class EditPublishClassSummaryModel {
  classId: number;
  className: string;
  baseFare: number;
  extraFare: number;
  discount: number;
  fareId: number;
  //classPublishedId: number;
  constructor(classId: number, className: string) {
    this.classId = classId;
    this.className = className;
  }
}
export class editPublishRequest {
  companyId: number;
  venueId: number;
  screenId: number;
  // screens: ScreenModel[] = [];
  screenPublishedId: number;
  showsPublished: EditShowsPublishedRequest[] = [];
  header: Header;
  constructor() {}
}

@Component({
  selector: "app-edit-publish",
  templateUrl: "./edit-publish.component.html",
  styleUrls: ["./edit-publish.component.scss"],
})
export class EditPublishComponent implements OnInit {
  seatClass: SeatLayoutResponse[];
  companyList: PublishDropDownModel[] = [];
  selectedCompany: PublishDropDownModel;
  venueList: PublishDropDownModel[] = [];
  selectedVenue: PublishDropDownModel;
  screenList: PublishDropDownModel[] = [];
  selectedScreen: PublishDropDownModel;
  selectedMovie: PublishDropDownModel;
  today: number = Date.now();
  bookingOpeningDate = new Date();
  fromDate = new Date();
  toDate = new Date();
  header = new Header(UUID.UUID());
  seatHeader = new SeatHeader();
  movieList: PublishDropDownModel[] = [];
  movieMap = new Map();
  classMap = new Map();
  showsCanceled: boolean;
  publishList: PublishModel[] = [];
  publishListTemp: PublishModel[] = [];
  publishDataSource: any;
  publishDisplaycolumns = ['showDate', 'showTime', 'movie', 'cancelShow', 'class', 'baseFare', 'extraAmount',
    'discount', 'tax', 'totalFareIncludingTax', 'seats'];
  showPopulatePublish = false;
  checkboxStatus: boolean;
  selectedData: ScreenModel;
  showSeatLayout: boolean = false;
  responseData: SeatStatusResponse;
  selectedSeats = new Array<Seat>();
  selectedSeatStatus: Array<string>;
  seat_layout: SelectedSeatLayout;
  seatOption: any;
  getUserId: string;
  getVenueId: any;
  responseSeat: any;
  city: any;
  showDetailsId: any;
  classPublishedId: number;
  isSuccess = true;
  seatBookingStatus: any;
  companyId: number;
  currentUser: any;
  operationAccessMap = new Map();

  spans = [];
  constructor(
    private restService: RestService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar,
    public tempDataService: TempDataService,
    private screenAccess: ScreenAccessService,
    private datePipe: DatePipe,
    private log: LogService,
    private http: HttpClient
  ) {}

  /**
   * Evaluated and store an evaluation of the rowspan for each row.
   * The key determines the column it affects, and the accessor determines the
   * value that should be checked for spanning.
   */
  cacheSpan(key, accessor) {
    for (let i = 0; i < this.publishList.length; ) {
      let currentValue = accessor(this.publishList[i]);
      let count = 1;

      // Iterate through the remaining rows to see how many match
      // the current value as retrieved through the accessor.
      for (let j = i + 1; j < this.publishList.length; j++) {
        if (currentValue != accessor(this.publishList[j])) {
          break;
        }

        count++;
      }

      if (!this.spans[i]) {
        this.spans[i] = {};
      }

      // Store the number of similar values that were found (the span)
      // and skip i to the next unique row.
      this.spans[i][key] = count;
      i += count;
    }
  }

  getRowSpan(col, index) {
    return this.spans[index] && this.spans[index][col];
  }


  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.companyId = this.currentUser.companyId;
    this.getCompanyData();
    this.screenAccess.loadOperationsAccessForScreen(
      "Movie Management",
      "Publish"
    );
    this.operationAccessMap = this.screenAccess.map;
    this.getAllMovies();
    this.selectedSeatStatus = [
      "AVAILABLE",
      "LOCKED",
      "DEFAULT BLOCKED",
      "SOCIAL DISTANCE",
    ];
    this.selectedSeats = [];
    this.seatOption = this.selectedSeatStatus[0];
  }

  private getCompanyData() {
    if (this.companyId != null && this.companyId != undefined) {
      if (this.companyId == -999) {
        this.getAllCompanyDetails();
      } else {
        this.getCompanyById(this.companyId);
      }
    }
  }

  private getCompanyById(companyId: number) {
    let companyRequest = <CompanyIdRequest>{};
    companyRequest.header = this.header;
    companyRequest.companyId = companyId;
    this.restService
      .post(companyRequest, environment.getParticularCompany)
      .map((company: any) => {
        if (company) {
          company.companies.forEach((erg) => {
            this.companyList.push(
              new PublishDropDownModel(erg.companyId, erg.companyName)
            );
          });
        }
      })
      .subscribe(
        (result) => {
          // this.results = result;
        },
        (err) => {}
      );
  }

  private getAllCompanyDetails() {
    this.companyList = [];
    this.venueList = [];
    this.screenList = [];
    let publishRequest = <PublishRequestHeader>{};
    publishRequest.header = this.header;

    this.restService.post(publishRequest, environment.getAllActiveCompanyPath)
      .map((company: any) => {
        if (company) {
          company.companies.forEach((erg) => {
            this.companyList.push(
              new PublishDropDownModel(erg.companyId, erg.companyName)
            );
          });
        }
      })
      .subscribe(
        (result) => {},
        (err) => {}
      );
  }

  private getAllVenueBaesdOnCompany(companyid: number) {
    this.venueList = [];
    this.screenList = [];
    let venueRequest = <Publish>{};
    venueRequest.companyId = companyid;
    venueRequest.header = this.header;
    this.restService
      .post(venueRequest, environment.getAllVenueByCompanyPath)
      .map((company: any) => {
        if (company) {
          localStorage.setItem("city", company.venues[0].locality.city);
          company.venues.forEach((erg) => {
            this.venueList.push(
              new PublishDropDownModel(erg.venueId, erg.venueName)
            );
          });
        }
      })
      .subscribe(
        (venueList) => {},
        (err) => {}
      );
  }

  private getAllScreenBasedOnVenue(venueId: number) {
    this.screenList = [];
    let screenRequest = <Publish>{
      venueId: venueId,
      header: this.header,
    };
    localStorage.setItem("venueId", JSON.stringify(venueId));
    this.restService
      .post(screenRequest, environment.viewAllScreenPath)
      .map((screen: any) => {
        if (screen) {
          screen.screens.forEach((erg) => {
            this.screenList.push(
              new PublishDropDownModel(erg.screenId, erg.screenName)
            );
          });
        }
      })
      .subscribe(
        (screenResult) => {},
        (err) => {}
      );
  }

  private getAllMovies() {
    this.movieList = [];
    this.movieMap = new Map();
    let movieRequest = <PublishRequestHeader>{
      header: this.header,
    };
    this.restService
      .post(movieRequest, environment.getAllMoviePath)
      .map((movie: any) => {
        let result: Array<PublishDropDownModel> = [];
        if (movie) {
          movie.movies.forEach((erg) => {
            this.movieMap.set(erg.movieId, erg.movieName);
            result.push(new PublishDropDownModel(erg.movieId, erg.movieName));
          });
          this.movieList = result;
          return result;
        }
      })
      .subscribe(
        (result) => {},
        (err) => {}
      );
  }

  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 && o1.id === o2.id;
  }
  calculateTotalFare(model: PublishModel) {
    const baseFare = Number(model.baseFare);
    const extraAmount = Number(model.extraFare);
    const discount = Number(model.discount);
  
    if (!isNaN(baseFare) && !isNaN(extraAmount) && !isNaN(discount)) {
      const totalFare = baseFare + extraAmount - discount;
      model.totalFareIncludingTax = totalFare.toFixed(2); // Update the totalFareIncludingTax property
    }
  }

  populateSavedData() {
    this.publishList = [];
    this.publishListTemp = [];

    this.showPopulatePublish = true;
    let publishRequest = <PublishEditRequestHeader>{
      header: this.header,
      fromDate: this.datePipe.transform(this.fromDate, "dd-MMM-yyyy"),
      toDate: this.datePipe.transform(this.toDate, "dd-MMM-yyyy"),
      screenId: this.selectedScreen.id,
      venueId: this.selectedVenue.id,
    };
    this.restService
      .post(publishRequest, environment.getPublishedShows)
      .map((res: any) => {
        if (res) {
          res.screenPublishedEntity.showsPublished.forEach(erg => {
            erg.classesPublished.forEach(obj => {
              let publishModel = new PublishModel();
              publishModel.showDate = erg.showDate;
              publishModel.showTime = erg.showTime.slice(0, -3);
              this.selectedMovie = new PublishDropDownModel(erg.movieId, this.movieMap.get(erg.movieId));
              publishModel.selectedMovie = this.selectedMovie;
              publishModel.movieList = this.movieList;
              if (erg.showCancelled == 1) {
                publishModel.cancelShow = true;
              } else {
                publishModel.cancelShow = false;
              }
              publishModel.screenPublishedId = res.screenPublishedEntity.screenPublishedId;
              publishModel.showPublishedId = erg.showPublishedId;
              this.showDetailsId = publishModel.showPublishedId;
              publishModel.classPublishedId = obj.classPublishedId;
              localStorage.setItem(
                "classpublishedId",
                JSON.stringify(publishModel.classPublishedId)
              );
              publishModel.classId = obj.classId;
              publishModel.className = obj.className;
              publishModel.extraFare = obj.extraFare;
              publishModel.fareId = obj.fareId;
              publishModel.discount = obj.discount;
              publishModel.baseFare = obj.baseFare;
              publishModel.tax = "0.0";
              publishModel.totalFareIncludingTax = "0.0";
              this.publishList.push(publishModel);
              this.publishListTemp.push(publishModel);

              //this.log.info("show Date "+showEntity.showDate + " -  Show Time "+showEntity.showTime +" - Class Id " +obj.classId);
            });
          });
          this.publishList.sort(function (a, b) {
            return a.showDate - b.showDate;
          });
          this.publishListTemp.sort(function (a, b) {
            return a.showDate - b.showDate;
          });

          let result: Array<PublishDropDownModel> = [];

          let map = new Map();

          result.push(new PublishDropDownModel(-1, "Select One"));

          this.publishList.forEach((showEntity) => {
            let obj = showEntity.selectedMovie;

            if (!map.get(obj.name)) {
              map.set(obj.name, obj.name);
              this.movieMap.set(obj.id, obj.name);
              result.push(new PublishDropDownModel(obj.id, obj.name));
            }
          });
          this.movieList = result;

          this.publishDataSource = new MatTableDataSource(this.publishList);

          this.showPopulatePublish = true;
          this.cacheSpan("showDate", (d) => d.showDate);
          this.cacheSpan("showTime", (d) => d.showDate + d.showTime);
          this.cacheSpan(
            "movie",
            (d) => d.showDate + d.showTime + d.selectedMovie.name
          );
          this.cacheSpan(
            "cancelShow",
            (d) => d.showDate + d.showTime + d.selectedMovie.name + d.cancelShow
          );
          this.cacheSpan(
            "cancelShow",
            (d) =>
              d.showDate +
              d.showTime +
              d.selectedMovie.name +
              d.cancelShow +
              d.seats
          );
          // this.cacheSpan('action', d => d.showDate + d.showTime + d.selectedMovie.name + d.cancelShow + d.action);
        }
      })
      .subscribe(result => {
      }, err => {
      });
  }



  onMovieChange(model: PublishModel) {
    for (let obj of this.publishList) {
      if (obj.showDate == model.showDate && obj.showTime == model.showTime) {
        obj.selectedMovie = model.selectedMovie;
      }
    }
    this.log.info(JSON.stringify(this.publishList));
  }

  onShowTimeChange(model: PublishModel) {
    for (let obj of this.publishList) {
      if (obj.showDate == model.showDate && obj.showTime == model.showTime) {
        obj.showTime = model.showTime;
      }
    }
  }

  onCancelShowChange(model: PublishModel) {
    for (let obj of this.publishList) {
      if (obj.showDate == model.showDate && obj.showTime == model.showTime) {
        obj.cancelShow = model.cancelShow;
      }
    }
  }

  removePublishRow(model: PublishModel) {
    let deletePublishList: PublishModel[] = [];
    for (let obj of this.publishList) {
      if (obj.showDate == model.showDate && obj.showTime == model.showTime) {
        deletePublishList.push(obj);
      }
    }
    for (let obj of deletePublishList) {
      for (let obj1 of this.publishList) {
        if (obj.showDate == obj1.showDate && obj.showTime == obj1.showTime) {
          this.publishList.splice(this.publishList.indexOf(obj1), 1);
        }
      }
    }
    this.publishDataSource = new MatTableDataSource(this.publishList);
  }

  onCompanyChange(company: PublishDropDownModel) {
    this.log.info("selected company is :: " + company.name);
    this.getAllVenueBaesdOnCompany(company.id);
  }

  onVenueChange(venue: PublishDropDownModel) {
    this.log.info("selected Venue is :: " + venue.name);
    this.getAllScreenBasedOnVenue(venue.id);
  }

  ediPublishDetails() {
    let request = new editPublishRequest();
    request.companyId = this.selectedCompany.id;
    request.venueId = this.selectedVenue.id;
    request.screenId = this.selectedScreen.id;
    let screenPublishedId = 0;
    let shows: EditShowsPublishedRequest[] = [];
    let map = new Map();
    for (let obj of this.publishList) {
      screenPublishedId = obj.screenPublishedId;
      let key: string = obj.showDate + obj.showTime;
      if (map.get(key)) {
        let show = map.get(key);
        let classesPublished: EditPublishClassSummaryModel[] =
          show.classesPublished;
        let classObj = new EditPublishClassSummaryModel(
          obj.classId,
          obj.className
        );
        classObj.baseFare = Number(obj.baseFare);
        classObj.discount = Number(obj.discount);
        classObj.fareId = Number(obj.fareId);
        classObj.extraFare = Number(obj.extraFare);
        // classObj.classPublishedId = Number(obj.classPublishedId);
        classesPublished.push(classObj);
        show.classesPublished = classesPublished;
        map.set(key, show);
      } else {
        let show = new EditShowsPublishedRequest();
        show.showPublishedId = obj.showPublishedId;
        // show.bookingOpeningDate = this.datePipe.transform(this.bookingOpeningDate, 'dd-MMM-yyyy');
        let classesPublished: EditPublishClassSummaryModel[] = [];
        let classObj = new EditPublishClassSummaryModel(
          obj.classId,
          obj.className
        );
        classObj.baseFare = Number(obj.baseFare);
        classObj.discount = Number(obj.discount);
        classObj.fareId = Number(obj.fareId);
        classObj.extraFare = Number(obj.extraFare);
        // classObj.classPublishedId = Number(obj.classPublishedId);
        classesPublished.push(classObj);
        show.classesPublished = classesPublished;
        show.movieId = obj.selectedMovie.id;
        if (obj.cancelShow) {
          show.showCancelled = true;
        } else {
          show.showCancelled = false;
        }
        // if (obj.approvalStatus) {
        //   show.approvalStatus = 1;
        // } else {
        //   show.approvalStatus = 0;
        // }
        show.showDate = obj.showDate;
        show.showTime = obj.showTime + ":00";
        map.set(key, show);
      }
    }
    shows = Array.from(map.values());
    request.showsPublished = shows;
    request.screenPublishedId = screenPublishedId;
    request.header = new Header(UUID.UUID());
    this.restService
      .post(request, environment.editPublishData)
      .map((publish: any) => {
        let result: PublishResponse;
        result = new PublishResponse(
          publish.status["statusCode"],
          publish.status["statusDescription"],
          publish.status["transactionId"]
        );
        return result;
      })
      .subscribe((result) => {
        this.log.info(
          "inside response" +
            result.statusCode +
            "" +
            result.statusDescription +
            "" +
            result.transactionId
        );
        if (result.statusCode == "1001") {
          this.openSnackBar("Successfully Saved", "success");
          this.showPopulatePublish = false;
          this.ngOnInit();
        } else if (result.statusCode == "1002") {
          this.openSnackBar(result.statusDescription, "publishe failed");
        } else {
          this.openSnackBar(result.statusDescription, "error");
        }
      });
  }

  back() {
    this.showPopulatePublish = false;
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  ///seat layout
  showSeatLayoutStatus() {
    this.showSeatLayout = true;
    this.showPopulatePublish = false;
  }

  getSeatLayoutBasedOnScreen() {
    const request = <SeatRepresentation>{};
    request.header = this.seatHeader;
    this.city = localStorage.getItem("city");
    request.location = this.city;
    request.showDetailsId = this.showDetailsId;
    this.restService
      .post(request, environment.seatingRepresentation)
      .subscribe((response) => {
        this.responseSeat = response;
        if (this.responseSeat.status.statusCode == "1001") {
          this.SeatRepresentationProcess(this.responseSeat);
        }
      });
  }

  SeatRepresentationProcess(response: any) {
    this.seatClass = response.seat_layout;
  }

  getViewSeatLayout() {
    this.showSeatLayout = true;
    this.getSeatLayoutBasedOnScreen();
  }

  seatStatusUpdate() {
    this.getUserId = localStorage.getItem("userId").replace(/\"/g, "");
    this.getVenueId = localStorage.getItem("venueId");
    let header = new Header(UUID.UUID());
    let request = new SeatStatusRequest();
    request.header = header;
    request.venueId = this.getVenueId;
    request.userId = this.getUserId;
    const selectedSeats = new SelectedClass(
      (this.classPublishedId = JSON.parse(
        localStorage.getItem("classPublished")
      )),
      this.selectedSeats
    );
    let seatLayout = [selectedSeats];
    let selectedSeatlayout = new SelectedSeatLayout(seatLayout);
    this.seat_layout = selectedSeatlayout;
    localStorage.setItem("seatlayout", JSON.stringify(this.seat_layout));
    this.seatBookingStatus = localStorage.getItem("seatStatus");
    request.seat_layout = JSON.parse(localStorage.getItem("seatlayout"));
    for (let i = 0; i < selectedSeatlayout.classes.length; i++) {
      for (let j = 0; j < selectedSeatlayout.classes[i].seats.length; j++) {
        request.seat_layout.classes[i].seats[j].bookingStatus =
          this.seatBookingStatus;
      }
    }

    this.restService.post(request, environment.selectedSeatPath)
      .map((seatStatus: any) => {
        let result: SeatStatusResponse;
        result = new SeatStatusResponse(
          seatStatus.status["statusCode"],
          seatStatus.status["statusDescription"],
          seatStatus.status["transactionId"]
        );
        return result;
      })
      .subscribe((result) => {
        this.log.info(
          "inside response" +
            result.statusCode +
            "" +
            result.statusDescription +
            "" +
            result.transactionId
        );
        this.responseData = result;
        this.log.info(this.responseData);
        if ((this.responseData.statusCode = "1001")) {
          this.isSuccess = true;
          this.openSnackBar("Successfully Updated Seat Status", "success");
          this.showPopulatePublish = false;
          this.showSeatLayout = false;
          this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          this.router.onSameUrlNavigation = "reload";
          this.router.navigate(["/edit-publish"]);
        } else {
          this.openSnackBar("Failed Updated Seat Status", "Fail");

          this.showSeatLayout = false;
        }
      });
  }

  radioChange(event: MatRadioChange) {
    this.seatOption = event.value;
    localStorage.setItem("seatStatus", this.seatOption);
  }

  backSeat() {
    this.showPopulatePublish = true;
    this.showSeatLayout = false;
  }

  seatSelect(seat: any, cls: Class) {
    localStorage.setItem(
      "classPublished",
      JSON.stringify(cls.classPublishedId)
    );
    if (
      seat.selectedstatus_ui == 0 ||
      seat.selectedstatus_ui == "" ||
      seat.selectedstatus_ui == null
    ) {
      seat.selectedstatus_ui = 1;
      this.selectedSeats.push(seat);
    } else {
      seat.selectedstatus_ui = 0;
      let index = this.selectedSeats.indexOf(seat.seatNumber);
      if (index !== -1) this.selectedSeats.splice(index, 1);
    }
  }
  cancelSeat() {
    this.showPopulatePublish = false;
    this.showSeatLayout = false;
  }
}
