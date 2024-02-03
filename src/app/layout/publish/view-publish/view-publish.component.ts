import { Component, OnInit } from '@angular/core';
import { Publish } from '../publish';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TempDataService } from '../../../shared/temp-dataStore';
import { UUID } from '../../../shared/services/uuid';
import { RestService } from '../../../api.service';
import { Header } from '../../../shared/services/header';


import { Headers } from '../../../shared/model/request-header';
 
import { Movie } from '../../movie/movie';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { PublishModel } from '../publish-model';
import { PublishResponse } from '../publishResponse';
import { PublishRequestHeader, PublishDropDownModel } from '../add-publish/add-publish.component';
import { CompanyIdRequest } from '../publish.component';
import { Fare } from '../../fare/fare';

export class PublishEditRequestHeader {
  header: Header;
  fromDate: string;
  toDate: string;
  screenId: number;
  venueId: number;
  constructor() { }
}

export class EditShowsPublishedRequest {
  //bookingOpeningDate: string;
  //classesPublished: EditPublishClassSummaryModel[] = [];
  showPublishedId: number;
  movieId: number;
  approve: number;
  //showCancelled: number;
  //showDate: string;
  //showTime: string;
  constructor() { }
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
export class MovieIdList {
  movieId: Movie;
  header: Header;
  constructor() { }
}
export class ShowPublishedIdList {
  showPublishedId: EditShowsPublishedRequest;
  header: Header;
  constructor() { }
}
export class approvePublishRequest {
  venueId: number;
  movieIds: number[] = [];
  showPublishedIdLists: number[] = [];
  approve: string;
  header: Header;
  constructor() { }
}

@Component({
  selector: 'app-view-publish',
  templateUrl: './view-publish.component.html',
  styleUrls: ['./view-publish.component.scss']
})
export class ViewPublishComponent implements OnInit {
  searchBy: string;
  headers: Headers;
  movieIdList: number[] = [];
  showPublishedIdList: number[] = [];
  companyList: PublishDropDownModel[] = [];
  selectedCompany: PublishDropDownModel;
  venueList: PublishDropDownModel[] = [];
  selectedVenue: PublishDropDownModel;
  screenList: PublishDropDownModel[] = [];
  selectedScreen: PublishDropDownModel;
  selectedMovie: PublishDropDownModel;
  selectAllApprove: boolean = false;
  today: number = Date.now();
  result:any=[];
  bookingOpeningDate = new Date();
  fromDate = new Date();
  toDate = new Date();
  header = new Header(UUID.UUID());

   



  movieList: PublishDropDownModel[] = [];
  movieMap = new Map();
  classMap = new Map();
  showsCanceled: boolean;
  publishList: PublishModel[] = [];
  publishDataSource: any;
  companyId: number;
  dataSource: any;
  
  currentUser: any;
  publishDisplaycolumns = ['showDate', 'showTime', 'movie', 'cancelShow', 'action', 'baseFare', 'extraAmount',
    'discount', 'tax', 'totalFareIncludingTax', 'approve'];
  showPopulatePublish = false;
  showPopulateDataPublish = false;

  summarySelection: boolean = false;

  spans = [];
  sort: any;
  paginator: any;
  constructor(private restService: RestService,
    public dialog: MatDialog, public router: Router,
    public snackBar: MatSnackBar, public tempDataService: TempDataService,
    private datePipe: DatePipe, private log: LogService) {
  }

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


  ngOnInit(): void {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.companyId = this.currentUser.companyId;
    this.getCompanyData();
    this.getAllMovies();
    this.headers = <Headers>{
      header: this.header,
    };
    
    this.getAllFareDetail();
    
  }
  private getAllFareDetail(): any {
    
    this.restService
      .post(this.headers, environment.getAllFarePath)
      .map((response: any) => {
        let result: Array<Fare> = [];
        if (response) {
          response.fares.forEach((erg) => {
           console.log(JSON.stringify(erg))
            let fare = new Fare(
              erg.fareId,
              erg.baseFare,
              erg.discountFare,
              erg.extraFare,
              // erg.fareDescription,
              // erg.fareName,
              // erg.tax,
              erg.charge
            );
            let taxes: Array<any> = [];
            if(erg.taxes)
            {
            erg.taxes.forEach((obj) => {
              taxes.push(obj);
            });
            fare.taxes = taxes;
          }
           
            fare.fareAmount =
              fare.baseFare + fare.extraFare - fare.discountFare;

              
            let charges: Array<any> = [];
            if(erg.charge)
            {
            erg.charge.forEach((obj) => {
              charges.push(obj);
            });
            fare.charges = charges;
          }
            result.push(fare);
          });
        }
        return result;
      })
      .subscribe(
        (result) => {
 
        
          
          this.result =( result);
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        (err) => { }
      );
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
    let publishRequest = <PublishRequestHeader>({});
    publishRequest.header = this.header;

    this.restService.post(publishRequest, environment.getAllActiveCompanyPath)
      .map((company: any) => {
        if (company) {
          company.companies.forEach(erg => {
            this.companyList.push(new PublishDropDownModel(erg.companyId,
              erg.companyName));
          });
        }
      })
      .subscribe(result => {
      }, err => {

      });
  }

  private getAllVenueBaesdOnCompany(companyid: number) {
    this.venueList = [];
    this.screenList = [];
    let venueRequest = <Publish>({})
    venueRequest.companyId = companyid;
    venueRequest.header = this.header;
    this.restService.post(venueRequest, environment.getAllVenueByCompanyPath)
      .map((company: any) => {
        if (company) {
          company.venues.forEach(erg => {
            this.venueList.push(new PublishDropDownModel(erg.venueId,
              erg.venueName));
          });
        }
      })
      .subscribe(venueList => {
      })
  }


  private getAllScreenBasedOnVenue(venueId: number) {
    this.screenList = [];
    let screenRequest = <Publish>({
      venueId: venueId,
      header: this.header
    })
    this.restService.post(screenRequest, environment.viewAllScreenPath)
      .map((screen: any) => {
        if (screen) {
          screen.screens.forEach(erg => {
            this.screenList.push(new PublishDropDownModel(erg.screenId,
              erg.screenName));
          });
        }
      })
      .subscribe(screenResult => {
      });
  }

  private getAllMovies() {

    this.movieList = [];
    this.movieMap = new Map();
    let movieRequest = <PublishRequestHeader>({
      header: this.header
    })
    this.restService.post(movieRequest, environment.getAllMoviePath)
      .map((movie: any) => {
        let result: Array<PublishDropDownModel> = [];
        if (movie) {
          movie.movies.forEach(erg => {

            this.movieMap.set(erg.movieId, erg.movieName);
            result.push(new PublishDropDownModel(erg.movieId,
              erg.movieName));
          });
          this.movieList = result;
          return result;
        }
      })
      .subscribe(result => {

      });
  }


  compareObjects(o1: any, o2: any): boolean {
    return o1 && o2 && o1.id === o2.id;
  }
  
  onSelectAllApproveChange()
  
 {
    this.publishList = [];
    this.spans = [];
    this. showPopulateDataPublish=false;
    this.publishDataSource = 
    new MatTableDataSource(this.publishList);
    this.showPopulatePublish = true;
    let publishRequest = <PublishEditRequestHeader>({
      header: this.header,
      fromDate: this.datePipe.transform(this.fromDate, 'dd-MMM-yyyy'),
      toDate: this.datePipe.transform(this.toDate, 'dd-MMM-yyyy'),
      screenId: this.selectedScreen.id,
      venueId: this.selectedVenue.id
      

    })
 
    this.restService.post(publishRequest, environment.getPublishedShows)
      .map((res: any) => {
        if (res) {

          res.screenPublishedEntity.showsPublished.forEach(erg => {

            erg.classesPublished.forEach(obj => {
             
              {
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
              if (erg.approvalStatus == true) {
                publishModel.approve = true;
              } else {
                publishModel.approve = false;
              }
              publishModel.screenPublishedId = res.screenPublishedEntity.screenPublishedId;
              publishModel.showPublishedId = erg.showPublishedId;
              publishModel.classPublishedId = obj.classPublishedId;
              publishModel.classId = obj.classId;
              publishModel.className = obj.className;
              publishModel.extraFare = obj.extraFare;
              publishModel.fareId = obj.fareId;
              publishModel.discount = obj.discount;
              publishModel.baseFare = obj.baseFare;
              publishModel.tax = '0.0';
              this. showPopulateDataPublish=true;
              publishModel.totalFareIncludingTax = '0.0';
              this.publishList.push(publishModel);
              //this.log.info("show Date "+erg.showDate + " -  Show Time "+erg.showTime +" - Class Id " +obj.classId);
              publishModel.totalFareIncludingTax = this.calculateTotalFare(publishModel).toFixed(2);
            }
            });

          });

          this.publishList.sort(function (a, b) {
            return a.showDate - b.showDate;
          });
          this.publishList.forEach(publishModel => {
            const totalFare = publishModel.baseFare + publishModel.extraFare - publishModel.discount;
            const tax = parseFloat(publishModel.tax); // Convert tax to a number
            const totalFareIncludingTax = totalFare + tax;
          
            publishModel.totalFareIncludingTax = totalFareIncludingTax.toFixed(2); // Format to 2 decimal places
          });
          this.publishDataSource = 
          new MatTableDataSource(this.publishList);


          
          this.showPopulatePublish = true;
          this.cacheSpan('showDate', d => d.showDate);
          this.cacheSpan('showTime', d => d.showDate + d.showTime);
          this.cacheSpan('movie', d => d.showDate + d.showTime + d.selectedMovie.name);
          this.cacheSpan('approve', d => d.showDate + d.showTime + d.selectedMovie.name + d.approve);
          this.cacheSpan('cancelShow', d => d.showDate + d.showTime + d.selectedMovie.name + d.approve + d.cancelShow);
          this.cacheSpan('action', d => d.showDate + d.showTime + d.selectedMovie.name + d.approve + d.cancelShow + d.action);
        }
      })
      .subscribe(result => { },
        err => { });
  }
  calculateTotalFare(publishModel: PublishModel): number {
    return publishModel.baseFare + publishModel.extraFare - publishModel.discount;
  }
  
  populateSavedData() {
    this.publishList = [];
    this.showPopulatePublish = true;
    this. showPopulateDataPublish=false;
    let publishRequest = <PublishEditRequestHeader>({
      header: this.header,
      fromDate: this.datePipe.transform(this.fromDate, 'dd-MMM-yyyy'),
      toDate: this.datePipe.transform(this.toDate, 'dd-MMM-yyyy'),
      screenId: this.selectedScreen.id,
      venueId: this.selectedVenue.id

    })
 
    this.restService.post(publishRequest, environment.getPublishedShows)
      .map((res: any) => {
        if (res) {

          res.screenPublishedEntity.showsPublished.forEach(erg => {

            erg.classesPublished.forEach(obj => {
              if (!erg.approvalStatus)
              {
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
              if (erg.approvalStatus == true) {
                publishModel.approve = true;
              } else {
                publishModel.approve = false;
              }
              publishModel.screenPublishedId = res.screenPublishedEntity.screenPublishedId;
              publishModel.showPublishedId = erg.showPublishedId;
              publishModel.classPublishedId = obj.classPublishedId;
              publishModel.classId = obj.classId;
              publishModel.className = obj.className;
              publishModel.extraFare = obj.extraFare;
              publishModel.fareId = obj.fareId;
              




            let obj1 = this.result.find(item => item.fareId == obj.fareId) ;
            

           
              this. showPopulateDataPublish=true;
              
              publishModel.discount = obj.discount;
              publishModel.baseFare = obj.baseFare;
              //this.log.info("show Date "+erg.showDate + " -  Show Time "+erg.showTime +" - Class Id " +obj.classId);
             
             
             
             
              publishModel.totalFareIncludingTax = this.calculateTotalFare(publishModel).toFixed(2);
              publishModel.tax = (obj1?
                
                ((parseFloat(obj1.charges[0].taxes[0].taxPercentage)*
                parseFloat(publishModel.totalFareIncludingTax))/100).toString() :'0.0');
              publishModel.totalFareIncludingTax = '0.0';


              
              this.publishList.push(publishModel);
             

           
            }
            });

          });

          this.publishList.sort(function (a, b) {
            return a.showDate - b.showDate;
          });
          this.publishList.forEach(publishModel => {
            const totalFare = publishModel.baseFare + publishModel.extraFare - publishModel.discount;
            const tax = parseFloat(publishModel.tax); // Convert tax to a number
            const totalFareIncludingTax = totalFare + tax;
          
            publishModel.totalFareIncludingTax = totalFareIncludingTax.toFixed(2); // Format to 2 decimal places
          });
          this.publishDataSource = new MatTableDataSource(this.publishList);
          this.showPopulatePublish = true;
          this.cacheSpan('showDate', d => d.showDate);
          this.cacheSpan('showTime', d => d.showDate + d.showTime);
          this.cacheSpan('movie', d => d.showDate + d.showTime + d.selectedMovie.name);
          this.cacheSpan('approve', d => d.showDate + d.showTime + d.selectedMovie.name + d.approve);
          this.cacheSpan('cancelShow', d => d.showDate + d.showTime + d.selectedMovie.name + d.approve + d.cancelShow);
          this.cacheSpan('action', d => d.showDate + d.showTime + d.selectedMovie.name + d.approve + d.cancelShow + d.action);
        }
      })
      .subscribe(result => { },
        err => { });
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
  onApproveChange(model: PublishModel) {
    for (let obj of this.publishList) {
      if (obj.showDate == model.showDate && obj.showTime == model.showTime) {
        obj.approve = model.approve;
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
    this.log.info('selected company is :: ' + company.name);
    this.getAllVenueBaesdOnCompany(company.id);
  }

  onVenueChange(venue: PublishDropDownModel) {
    this.log.info('selected Venue is :: ' + venue.name);
    this.getAllScreenBasedOnVenue(venue.id);
  }

  approvePublishDetails() {

    let request = new approvePublishRequest();
    request.approve = "true";
    let i = 0;

    for (let obj of this.publishList) {
      if (obj.approve) {
        this.movieIdList[i] = obj.selectedMovie.id;
        this.showPublishedIdList[i] = obj.showPublishedId;
        i++;
      }
    }

    request.movieIds = this.movieIdList.filter((v, i, a) => a.indexOf(v) === i);
    request.showPublishedIdLists = this.showPublishedIdList.filter((v, i, a) => a.indexOf(v) === i);
    request.venueId = this.selectedVenue.id;
    request.header = new Header(UUID.UUID());
    this.restService.post(request, environment.approvePublishedShows)
      .map((publish: any) => {
        let result: PublishResponse;
        result = new PublishResponse(publish.status["statusCode"], publish.status["statusDescription"], publish.status["transactionId"]);
        return result;

      })
      .subscribe(result => {
        this.log.info("inside response" + result.statusCode + "" + result.statusDescription + "" + result.transactionId);
        if (result.statusCode = '1001') {
          this.openSnackBar("Successfully Saved", "success");
          this.router.navigate(["/edit-publish"])
        } else if (result.statusCode = '1002') {
          this.openSnackBar(result.statusDescription, "error");
        }

      })

  }


  back() {
    this.showPopulatePublish = false;
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  checkUncheckAllData(completed: boolean) {

    this.publishList.forEach(t => t.approve = completed);
  }
  showall(completed: boolean) {

    if(completed)
    {
this.onSelectAllApproveChange();
    }
    else
    {
      this.populateSavedData()
    }
    
  }}