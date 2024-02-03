import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import { Headers } from '../../shared/model/request-header';
import { Company } from '../company/company';
import { Publish } from './publish';
import { Dataobject } from './dataobject';
import { RestService } from '../../api.service';
import { PublishShowRequest } from './publishshowrequest';
import { PublishShowSummaryRequest } from './publishshowsummaryrequest';
import { PublishClassRequest } from './publishclassrequest';
import { PublishClassSummaryRequest } from './publishclasssummaryrequest';
import { TempDataService } from '../../shared/temp-dataStore';
import { ShowPublishTableComponent } from './show-publish-table/show-publish-table.component';
import { Header } from '../../shared/services/header';
import { UUID } from '../../shared/services/uuid';
import { LogService } from '../../shared/services/log.service';
import { environment } from '../../../environments/environment';

export class CompanyIdRequest {
  header: Header;
  companyId: number;
  constructor() { }
}
@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.scss']
})
export class PublishComponent implements OnInit {
  companyId: number;
  currentUser: any;
  ioObjArray: Company[] = [];
  totalItems: any;
  selectedData: Publish;
  headers: Headers;
  header = new Header(UUID.UUID());
  result: Array<Dataobject> = [];
  venueResult: Array<Dataobject> = [];
  screenResult: Array<Dataobject> = [];
  movieResult: Array<Dataobject> = [];
  classResult: Array<Dataobject> = [];

  queryString: string = ""
  errorMessage: string = '';
  isLoading: boolean = true;

  selectedCompanyData: Dataobject;
  selectedVenueData: Dataobject;
  selectedScreenData: Dataobject;
  selectedBookingData: any;

  publishShowRequest: PublishShowRequest;
  publishShowSummeryRequest: PublishShowSummaryRequest;
  publishClassRequest: PublishClassRequest;
  publishClassSummeryRequest: PublishClassSummaryRequest;

  publishShowRequestArr: Array<PublishShowRequest> = [];
  publishShowSummeryRequestArr: Array<PublishShowSummaryRequest> = [];
  publishClassRequestArr: Array<PublishClassRequest> = [];
  publishClassSummeryRequestArr: Array<PublishClassSummaryRequest> = [];

  public disp: boolean = false;
  times: string[] = ['10:00:00', '14:00:00', '18:00:00', '21:00:00'];
  dateArray = [];

  
  constructor(private restService: RestService,
    public dialog: MatDialog, public router: Router,
    public snackBar: MatSnackBar, public tempDataService: TempDataService, private log: LogService) {


  }
  myControl: FormControl = new FormControl();
  companyControl: FormControl = new FormControl();
  venueControl: FormControl = new FormControl();
  screenControl: FormControl = new FormControl();
  movieControl: FormControl = new FormControl();
  publishMovieControl: FormControl = new FormControl();


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
    
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.companyId = this.currentUser.companyId;
    this.getCompanyData();
    
    this.getAllCompanyDetails();
    this.getAllMovieDetails();
    this.loadDefaultValues();
    this.loadShowTime()
  }
  private getCompanyData() {
    if(this.companyId!=null && this.companyId!= undefined) {
      if(this.companyId == -999) {
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
          this.result.push(
            new Dataobject(erg.companyId, erg.companyName)
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
    this.restService.post(this.headers, environment.viewCompanyPath)
      .map((company: any) => {
        if (company) {
          company.companies.forEach(erg => {
            this.result.push(new Dataobject(erg.companyId,
              erg.companyName));
          });
        }
        this.totalItems = this.result;
        return this.result;
      })
  }

  getAllVenueDetails(companyid) {
    this.venueControl.reset();
    this.venueResult = [];
    let getVenues = <Publish>({})
    getVenues.companyId = companyid;
    getVenues.header = this.header;
    this.restService.post(getVenues, environment.viewAllVenuePath)
      .map((company: any) => {
        if (company) {
          company.venues.forEach(erg => {
            this.venueResult.push(new Dataobject(erg.venueId,
              erg.venueName));
          });
        }
        this.totalItems = this.venueResult;
        return this.venueResult;
      })
  }

  getAllScreenByVenueDetails(venueid) {
    this.screenControl.reset();
    this.screenResult = [];
    let getScreens = <Publish>({})
    getScreens.venueId = venueid;
    getScreens.header = this.header;
    this.restService.post(getScreens, environment.viewAllScreenPath)
      .map((screen: any) => {
        if (screen) {
          screen.screens.forEach(erg => {
            this.screenResult.push(new Dataobject(erg.screenId,
              erg.screenName));
          });
        }
        this.totalItems = this.screenResult;
        return this.screenResult;
      })
  }

  getAllClassesByScreenDetails(screenId) {
    this.classResult;
    let getClasses = <Publish>({})
    getClasses.screenId = screenId;
    getClasses.header = this.header;
    this.restService.post(getClasses, environment.getAllClassesByScreen)
      .map((classObj: any) => {
        if (classObj) {
          classObj.classes.forEach(erg => {
            this.classResult.push(erg.classId, erg.className);
            this.publishClassSummeryRequestArr.push(new PublishClassSummaryRequest(erg.classId,
              erg.baseFare, erg.extraFare, erg.fareId, erg.className));
          });
        }
        this.totalItems = this.classResult;
        //   this.selectedData.classSummaryPublished=this.classResult
        this.disp = !this.disp;
        return this.classResult;
      })
  }

  displayFn(data: Dataobject): string | undefined {
    this.log.info("I am here" + JSON.stringify(data));
    return data ? data.name : undefined;
  }

  private getAllMovieDetails() {
    this.restService.post(this.headers, environment.getAllMoviePath)
      .map((movie: any) => {
        if (movie) {
          movie.movies.forEach(erg => {
            this.movieResult.push(new Dataobject(erg.movieId,
              erg.movieName));
          });
        }
        this.totalItems = this.movieResult;
        return this.movieResult;
      })
      .subscribe(result => {

      })
  }

  public show: boolean = false;
  toggle() {
    this.show = !this.show;
  }


  publishData() {
    this.show = !this.show;
    if (this.selectedCompanyData != null) {
      this.selectedData.companyId = this.selectedCompanyData.id;
    }
    if (this.selectedVenueData != null) {
      this.selectedData.venueId = this.selectedVenueData.id;
    }
    if (this.selectedScreenData != null) {
      this.selectedData.screenId = this.selectedScreenData.id;
    }
    if (this.selectedData.showSummaryPublished != null) {
      this.selectedData.showSummaryPublished.map(obj => {
        obj.movieId = obj.selectedMovieData.id;
      })
    }
    if (this.selectedData.showsPublished = null) {
      this.selectedData.showsPublished.map(obj => {
        obj.classesPublished.map(clsobj => {
        })
      })
    }

    let startDate: any = new Date(this.selectedData.fromDate);
    let endDate: any = new Date(this.selectedData.toDate);
    let bookdate = this.selectedData.bookingOpeningDate;

    let date = startDate;
    //date = new Date(date.setDate(date.getDate()-1));
    while (date <= endDate) {
      const day = date.getUTCDate() + 1;
      const month = date.getUTCMonth() + 1;
      const year = date.getFullYear();
      let date1 = `${day}-${month}-${year}`;
      this.selectedData.showSummaryPublished.map(showSummeryObj => {
        this.publishClassSummeryRequestArr.map(obj => {
          this.publishClassRequestArr.push(new PublishClassRequest(obj.classId, obj.baseFare, obj.extraFare, 0, obj.fareId, obj.className));
        })
        this.publishShowRequestArr.push(new PublishShowRequest(date1, this.selectedData.bookingOpeningDate, showSummeryObj.showTime, showSummeryObj.movieId, 20, this.publishClassRequestArr, showSummeryObj.selectedMovieData))
        this.publishClassRequestArr = [];
      })
      //  this.dateArray.push(date);
      date = new Date(date.setDate(date.getDate() + 1));
    }
    this.selectedData.showsPublished = this.publishShowRequestArr;
  }

  loadShowTime() {
    let showValue = <PublishShowSummaryRequest>({})
    this.times.map(timeObj => {
      showValue.showTime = timeObj;
      let showTimeArr = new PublishShowSummaryRequest(0, timeObj)
      this.publishShowSummeryRequestArr.push(showTimeArr)
      // showValue.selectedMovieData=this.movieResult
    })
    this.selectedData.showSummaryPublished = this.publishShowSummeryRequestArr;
    this.tempDataService.changeSelecedData(this.selectedData);
  }
  deletedialogRef;


  preview(uniqueaccountType) {
    this.deletedialogRef = this.dialog.open(ShowPublishTableComponent, {

      disableClose: true
    });
    this.deletedialogRef.afterClosed().subscribe(result => {
      this.log.info("after closed:result");
      this.log.info(result);
      if (result === true) {
        // this.publishData();
        this.tempDataService.changeSelecedData(uniqueaccountType);
        // this.deleteDetail(uniqueaccountType);
      } else {

      }
    });
    this.deletedialogRef.componentInstance.modal_name = "DELETE ACCOUNT"
  }

}



