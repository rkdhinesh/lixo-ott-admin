import { Component, OnInit } from "@angular/core";
import { Publish } from "../publish";
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { TempDataService } from "../../../shared/temp-dataStore";
import { UUID } from "../../../shared/services/uuid";
import { RestService } from "../../../api.service";
import { Header } from "../../../shared/services/header";
import { LogService } from "../../../shared/services/log.service";
import { environment } from "../../../../environments/environment";
import { DatePipe } from "@angular/common";
import { PublishModel } from "../publish-model";
import { CompanyIdRequest } from "../publish.component";
import { AddPubishedShow } from "./AddPubishedShow";
import { NotificationService } from "../../../shared/services/notification.service";
import { PublishResponse } from "../publishResponse";

export class PublishRequestHeader {
  header: Header;
  constructor() { }
}

export class PublishDropDownModel {
  id: number;
  name: string;
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class approvePublishRequest {
  venueId: number;
  movieIds: number[] = [];
  showPublishedIdLists: number[] = [];
  approve: string;
  boxofficeonly: boolean;
  header: Header;
  constructor() { }
}
export class Tax {
  taxId: number;
  taxName: string;
  taxPercentage: number;
  constructor(taxId: number, taxName: string, taxPercentage: number) {
    this.taxId = taxId;
    this.taxName = taxName;
    this.taxPercentage = taxPercentage;
  }
}

export class chargeList {
  chargeId: number;
  chargeName: string;
  chargeAmount: number;
  taxes: Array<Tax>;
  constructor(
    chargeId: number,
    chargeName: string,
    chargeAmount: number,
    taxes: Array<Tax>
  ) {
    this.chargeId = chargeId;
    this.chargeName = chargeName;
    this.chargeAmount = chargeAmount;
    this.taxes = taxes;
  }
}
export class PublishClassSummaryModel {
  classId: number;
  className: string;
  baseFare: number;
  extraFare: number;
  discount: number;
  fareId: number;
  taxes: Array<Tax> = [];
  charges: Array<chargeList> = [];
  totalFare: number;
  fareTax: number;
  charge: number;
  chargeTax: number;
  totalAmount: number;
  totalTax: number;
  taxpercentage: number;
  constructor(classId: number, className: string) {
    this.classId = classId;
    this.className = className;
  }
}

export class PublishScreenSummaryModel {
  showTime: string;
  selectedMovie: PublishDropDownModel;
  movieList: PublishDropDownModel[] = [];
  constructor() { }
}

export class ShowSummaryPublishedRequest {
  showTime: string;
  movieId: number;
  constructor() { }
}

export class ShowsPublishedRequest {
  // bookingOpeningDate: string;
  classesPublished: PublishClassSummaryModel[] = [];
  movieId: number;
  showCancelled: boolean;
  boxOfficeOnlyFlag: boolean;
  showDate: string;
  showTime: string;
  //approvalStatus: number;
  constructor() { }
}

export class AddPublishRequest {
  //bookingOpeningDate: string;
  //classSummaryPublished: PublishClassSummaryModel[] = [];//class List
  companyId: number;
  venueId: number;
  screenId: number;
  //fromDate: string;
  //toDate: string;
  // showsCanceled: number;
  showsPublished: ShowsPublishedRequest[] = [];
  //showSummaryPublished: ShowSummaryPublishedRequest[] = [];
  header: Header;
  constructor() { }
}

@Component({
  selector: "app-add-publish",
  templateUrl: "./add-publish.component.html",
  styleUrls: ["./add-publish.component.scss"]
})
export class AddPublishComponent implements OnInit {

  companyList: PublishDropDownModel[] = [];
  selectedCompany: PublishDropDownModel;
  venueList: PublishDropDownModel[] = [];
  selectedVenue: PublishDropDownModel;
  screenList: PublishDropDownModel[] = [];
  screen: PublishDropDownModel[] = [];
  selectedScreen: PublishDropDownModel;
  today: number = Date.now();
  fromDate = new Date();
  toDate = new Date();
  classDataSource: any;
  classSummaryDisplaycolumns = ["className", "baseFare","extraFare", "discount"];
  classList: PublishClassSummaryModel[] = [];
  screenSummaryList: PublishScreenSummaryModel[] = [];
  movieList: PublishDropDownModel[] = [];
  showsCanceled: boolean;
  boxOfficeOnlyFlag: boolean;
  publishList: PublishModel[] = [];
  publishDataSource: any;
  fareAmout: number = 0;
  defaultDaystoPublish: number = 0;
  companyId: number;
  currentUser: any;
  alreadypublishedshows: Array<AddPubishedShow> = [];
  publishDisplaycolumns = [
    "showDate",
    "showTime",
    "movie",
    "cancelShow",
    "boxofficeonly",
    "action",
    "class",
    "baseFare",
    "extraAmount",
    "discount",
    "fareTax",
    "charge",
    "chargeTax",
    "totalTax",
    "totalAmount"
  ];
  

  showPopulatePublish = false;
  header = new Header(UUID.UUID());

  summarySelection: boolean = false;

  spans = [];
  selectedShows: any;
  showtime = [];
  arrayLength: number = 0;

  constructor(
    private restService: RestService,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar,
    private notifyService : NotificationService,
    public tempDataService: TempDataService,
    private datePipe: DatePipe,
    private log: LogService
  ) { }
  /**
   * Evaluated and store an evaluation of the rowspan for each row.
   * The key determines the column it affects, and the accessor determines the
   * value that should be checked for spanning.
   */
  cacheSpan(key, accessor) {
    for (let i = 0; i < this.publishList.length;) {
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


  // getColSpan(row, index) {
  //   return this.spans[index] && this.spans[index][row];
  // }

  onCompanyChange(company: PublishDropDownModel) {
    this.log.info("selected company is :: " + company.name);
    this.getAllVenueBaesdOnCompany(company.id);
    this.summarySelection = false;
  }

  onVenueChange(venue: PublishDropDownModel) {
    this.log.info("selected Venue is :: " + venue.name);
    this.getAllScreenBasedOnVenue(venue.id);
    this.summarySelection = false;
  }

  onScreenChange(screen: PublishDropDownModel) {
    this.log.info("selected Screen is :: " + screen.name);
    this.getAllClassesByScreenDetails(screen.id);
    this.toDate.setDate(this.toDate.getDate() + this.defaultDaystoPublish);
    this.getScreenDetails(screen.id);
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.companyId = this.currentUser.companyId;
    this.getCompanyData();
    this.getAllMovies();
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
    let companyRequest = <CompanyIdRequest>({});
    companyRequest.header = this.header;
    companyRequest.companyId = companyId;
    this.restService.post(companyRequest, environment.getParticularCompany)
      .map((company: any) => {
        if (company) {
          company.companies.forEach(erg => {
            this.companyList.push(
              new PublishDropDownModel(erg.companyId, erg.companyName)
            );
          });
        }
      })
      .subscribe(result => {
        // this.results = result;
      }, err => {

      });
  }

  private getAllCompanyDetails() {
    this.companyList = [];
    this.venueList = [];
    this.screenList = [];
    this.classList = [];
    this.classDataSource = new MatTableDataSource(this.classList);
    let publishRequest = <PublishRequestHeader>{};
    publishRequest.header = this.header;
    debugger;
    this.restService
      .post(publishRequest, environment.getAllActiveCompanyPath)
      .map((company: any) => {
        if (company) {
          company.companies.forEach(erg => {
            this.companyList.push(
              new PublishDropDownModel(erg.companyId, erg.companyName)
            );
          });
        }
      })
      .subscribe(
        result => { },
        err => { }
      );
  }

  private getAllVenueBaesdOnCompany(companyid: number) {
    this.venueList = [];
    this.screenList = [];
    this.classList = [];
    this.classDataSource = new MatTableDataSource(this.classList);
    let venueRequest = <Publish>{};
    venueRequest.companyId = companyid;
    venueRequest.header = this.header;
    this.restService
      .post(venueRequest, environment.getAllVenueByCompanyPath)
      .map((company: any) => {
        let defaultdays;
        if (company) {
          company.venues.forEach(erg => {
            this.venueList.push(
              new PublishDropDownModel(erg.venueId, erg.venueName)
            );
            defaultdays = erg.defaultDaysToPublish;
          });
          this.defaultDaystoPublish = defaultdays;
        }
      })
      .subscribe(
        venueList => { },
        err => { }
      );
  }

  private getAllScreenBasedOnVenue(venueId: number) {
    this.screenList = [];
    let screenRequest = <Publish>{
      venueId: venueId,
      header: this.header
    };
    this.restService
      .post(screenRequest, environment.viewAllScreenPath)
      .map((screen: any) => {
        if (screen) {
          screen.screens.forEach(erg => {
            this.screenList.push(
              new PublishDropDownModel(erg.screenId, erg.screenName)
            );
          });
        }
      })
      .subscribe(
        screenResult => { },
        err => { }
      );
  }

  private getAllMovies() {
    this.movieList = [];

    let movieRequest = <PublishRequestHeader>{
      header: this.header
    };
    this.restService
      .post(movieRequest, environment.getAllMoviePath)
      .map((movie: any) => {
        let result: Array<PublishDropDownModel> = [];
        if (screen) {
          movie.movies.forEach(erg => {
            result.push(new PublishDropDownModel(erg.movieId, erg.movieName));
          });
          this.movieList = result;
          return result;
        }
      })
      .subscribe(
        result => {
          // need to call a screen timing service
          this.screenSummaryList = [];
          let screenSummaryModel = new PublishScreenSummaryModel();
          screenSummaryModel.movieList = result;
          if (this.movieList.length > 0) {
            screenSummaryModel.selectedMovie = result[0];
          }
        },
        err => { }
      );
  }

  getScreenDetails(screenId: number) {
    this.screen = [];
    let classRequest = <Publish>{};
    classRequest.screenId = screenId;
    classRequest.header = this.header;
    this.restService
      .post(classRequest, environment.getScreenDetails)
      .map((screen: any) => {
        let result: Array<PublishDropDownModel> = [];
        if (screen) {
          localStorage.setItem("screen", JSON.stringify(screen.screens));
          screen.screens.forEach(erg => {
            this.screen.push(
              new PublishDropDownModel(erg.screenId, erg.screenName))
          });
        }
        this.selectedShows = JSON.parse(localStorage.getItem("screen"));
        for (let Time of this.selectedShows) {
          this.selectedShows = Time.defaultShowTimes;
          for (let shows of Time.defaultShowTimes) {
            this.showtime[this.arrayLength] = shows;
            this.arrayLength++;
          }
        }
        for (let displayTime of this.showtime) {
          let screenSummaryModel = new PublishScreenSummaryModel();
          screenSummaryModel.movieList = this.movieList;
          if (this.movieList.length > 0) {
            screenSummaryModel.selectedMovie = this.movieList[0];
          }
          screenSummaryModel.showTime = displayTime;
          this.screenSummaryList.push(screenSummaryModel);
        }
      })
      .subscribe(
        result => {
        },
        err => { }
      );
  }


  getAllClassesByScreenDetails(screenId: number) {

    this.classList = [];
    this.classDataSource = new MatTableDataSource(this.classList);

    let classRequest = <Publish>{};
    classRequest.screenId = screenId;
    classRequest.header = this.header;
    this.restService
      .post(classRequest, environment.getAllClassesByScreen)
      .map((response: any) => {
        let result: Array<PublishClassSummaryModel> = [];
        if (response) {
          response.classes.forEach(erg => {
            let classModel = new PublishClassSummaryModel(
              erg.classId,
              erg.className
            );
            classModel.extraFare = erg.extraFare;
            classModel.discount = erg.discount;
            classModel.baseFare = erg.baseFare;
            classModel.fareId = erg.fareId;
            let taxPercentage = 0;
            erg.taxes.forEach(tax => {
              classModel.taxes.push(
                new Tax(tax.taxId, tax.taxName, tax.taxPercentage)
              );
              taxPercentage += tax.taxPercentage;
            });
            let chargeAmount = 0;
            let chargeTax = 0;
            erg.charges.forEach(charge => {
              classModel.charges.push(
                new chargeList(
                  charge.chargeId,
                  charge.chargeName,
                  charge.chargeAmount,
                  charge.taxes.forEach(ctax => {
                    new Tax(ctax.taxId, ctax.taxName, ctax.taxPercentage);
                    chargeTax += ctax.taxPercentage;
                  })
                )
              );
              chargeAmount += charge.chargeAmount;
            });

            classModel.fareTax =
              (classModel.baseFare +
                classModel.extraFare -
                classModel.discount) *
              (taxPercentage / 100);
            classModel.charge = chargeAmount;
            classModel.chargeTax = (Number)((chargeAmount * (chargeTax / 100)).toFixed(2));
            classModel.totalAmount =
              (Number)((classModel.baseFare +
                classModel.extraFare -
                classModel.discount +
                classModel.fareTax +
                classModel.charge +
                classModel.chargeTax).toFixed(2));
            classModel.totalTax = (Number)((classModel.fareTax + classModel.chargeTax).toFixed(2));
            result.push(classModel);
          });
        }
        this.classList = result;
        if (this.classList.length > 0) {
          this.summarySelection = true;
        }
        this.classDataSource = new MatTableDataSource(result);
        return result;
      })
      .subscribe(
        result => { },
        err => { }
      );
  }

  populatePublishData() {
    this.publishList = [];

    let startDate: Date = new Date(
      this.datePipe.transform(this.fromDate, "dd-MMM-yyyy")
    );
    let endDate: Date = new Date(
      this.datePipe.transform(this.toDate, "dd-MMM-yyyy")
    );

    let currentDate = startDate,
      addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
      };
    while (currentDate <= endDate) {
      this.log.info(currentDate);

      for (let obj of this.screenSummaryList) {
        for (let classObj of this.classList) {
          let publishModel = new PublishModel();
          publishModel.showDate = currentDate;
          publishModel.showTime = obj.showTime;
          publishModel.selectedMovie = obj.selectedMovie;
          publishModel.movieList = obj.movieList;
          publishModel.cancelShow = false;
          publishModel.boxofficeonly = false;
          publishModel.classId = classObj.classId;
          publishModel.className = classObj.className;
          publishModel.extraFare = classObj.extraFare;
          publishModel.fareId = classObj.fareId;
          publishModel.discount = classObj.discount;
          publishModel.baseFare = classObj.baseFare;
          publishModel.fareTax = classObj.fareTax;
          publishModel.charge = classObj.charge;
          publishModel.chargeTax = classObj.chargeTax;
          publishModel.totalAmount = classObj.totalAmount;
          publishModel.totalTax = classObj.totalTax;
          this.publishList.push(publishModel);
        }
      }

      currentDate = addDays.call(currentDate, 1);
    }

    this.publishDataSource = new MatTableDataSource(this.publishList);
    this.showPopulatePublish = true;
    this.cacheSpan("showDate", d => d.showDate);
    this.cacheSpan("showTime", d => d.showDate + d.showTime);
    this.cacheSpan(
      "movie",
      d => d.showDate + d.showTime + d.selectedMovie.name
    );
    this.cacheSpan(
      "cancelShow",
      d => d.showDate + d.showTime + d.selectedMovie.name + d.cancelShow
    );
    this.cacheSpan('boxofficeonly', d => d.showDate + d.showTime + d.selectedMovie.name + d.boxofficeonly);

    this.cacheSpan(
      "action",
      d =>
        d.showDate + d.showTime + d.selectedMovie.name + d.cancelShow + d.action
    );
  }

  onMovieChange(index: number) {
    for (let j = index + 1; j < this.classList.length; j++) {
      this.publishList[j].selectedMovie = this.publishList[index].selectedMovie;
    }
    this.log.info(JSON.stringify(this.publishList));
  }

  onShowTimeChange(index: number) {
    for (let j = index + 1; j < this.classList.length; j++) {
      this.publishList[j].showTime = this.publishList[index].showTime;
    }
  }

  onCancelShowChange(index: number) {
    console.log("cancelll" + index)
    for (let j = index + 1; j < this.classList.length; j++) {
      this.publishList[j].cancelShow = this.publishList[index].cancelShow;
    }
  }




  onboxofficeonlyChange(model: PublishModel) {
    for (let obj of this.publishList) {
      if (obj.showDate == model.showDate && obj.showTime == model.showTime) {
        obj.boxofficeonly = model.boxofficeonly;
      }
    }
  }


  addScreenSummary() {
    let screenSummaryModel = new PublishScreenSummaryModel();
    screenSummaryModel.movieList = this.movieList;
    if (this.movieList.length > 0) {
      screenSummaryModel.selectedMovie = this.movieList[0];
    }
    screenSummaryModel.showTime = "";
    this.screenSummaryList.push(screenSummaryModel);

  }
  removePublishRow() {
    this.screenSummaryList.pop();
  }


  removePublishRow1(model: PublishModel) {

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

  addPublishDetails() {
    let request = new AddPublishRequest();

    for (let obj of this.classList) {
      let classObj = new PublishClassSummaryModel(obj.classId, obj.className);
      classObj.baseFare = Number(obj.baseFare);
      classObj.discount = Number(obj.discount);
      classObj.fareId = Number(obj.fareId);
      classObj.extraFare = Number(obj.extraFare);
    }

    let showSummaryPublished: ShowSummaryPublishedRequest[] = [];
    for (let obj of this.screenSummaryList) {
      let model = new ShowSummaryPublishedRequest();
      model.movieId = obj.selectedMovie.id;

      showSummaryPublished.push(model);
    }

    request.companyId = this.selectedCompany.id;
    request.venueId = this.selectedVenue.id;
    request.screenId = this.selectedScreen.id;

    let shows: ShowsPublishedRequest[] = [];

    let map = new Map();
    for (let obj of this.publishList) {
      let key: string = obj.showDate + obj.showTime;

      if (map.get(key)) {
        let show = map.get(key);
        let classesPublished: PublishClassSummaryModel[] =
          show.classesPublished;
        let classObj = new PublishClassSummaryModel(obj.classId, obj.className);
        classObj.baseFare = Number(obj.baseFare);
        classObj.discount = Number(obj.discount);
        classObj.fareId = Number(obj.fareId);
        classObj.extraFare = Number(obj.extraFare);
        classesPublished.push(classObj);
        show.classesPublished = classesPublished;
        map.set(key, show);
      } else {
        let show = new ShowsPublishedRequest();

        let classesPublished: PublishClassSummaryModel[] = [];
        let classObj = new PublishClassSummaryModel(obj.classId, obj.className);
        classObj.baseFare = Number(obj.baseFare);
        classObj.discount = Number(obj.discount);
        classObj.fareId = Number(obj.fareId);
        classObj.extraFare = Number(obj.extraFare);
        classesPublished.push(classObj);
        show.classesPublished = classesPublished;
        show.movieId = obj.selectedMovie.id;
        if (obj.cancelShow) {
          show.showCancelled = true;
        } else {
          show.showCancelled = false;
        }

        if (obj.boxofficeonly) {
          show.boxOfficeOnlyFlag = true;
        } else {
          show.boxOfficeOnlyFlag = false;
        }

        show.showDate = this.datePipe.transform(obj.showDate, "dd-MMM-yyyy");
        show.showTime = obj.showTime + ":00";
        map.set(key, show);
      }
    }

    shows = Array.from(map.values());
    request.showsPublished = shows;
    request.header = new Header(UUID.UUID());

    this.restService
      .post(request, environment.savePublishData)
      .map((publish: any) => {
        let result: PublishResponse;
        if (publish) {
          publish.showsPublished.forEach(erg => {
              let obj = new AddPubishedShow(erg.showDate,erg.showTime);              
              this.alreadypublishedshows.push(obj);
          });
        }
        result = new PublishResponse(
          publish.status["statusCode"],
          publish.status["statusDescription"],
          publish.status["transactionId"]
        );
        return result;
      })
      .subscribe(result => {
        this.log.info(
          "inside response" +
          result.statusCode +
          "" +
          result.statusDescription +
          "" +
          result.transactionId
        );
        if ((result.statusCode == "1001")) {
          if(this.alreadypublishedshows.length === 0) {
            this.openSnackBar("Operation Success", "Success");
          } else {
          this.notifyService.openToasterSuccess("Already Published Shows", 
            JSON.stringify(this.alreadypublishedshows))
          }
          this.router.navigate(["/edit-publish"])
        } else if ((result.statusCode == "1002")) {
          this.openSnackBar(result.statusDescription, "Operation Failed");
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
      duration: 2000
    });
  }



  checkUncheckAllData(completed: boolean) {

    this.publishList.forEach(t => t.cancelShow = completed);
  }

  checkUncheckAllData1(completed: boolean) {

    this.publishList.forEach(t => t.boxofficeonly = completed);
  }


}
