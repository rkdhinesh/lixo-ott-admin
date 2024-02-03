import { Component, OnInit, ViewChild } from '@angular/core';
import { Venue } from './venue';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RestService } from '../../api.service';
import { TempDataService } from '../../shared/temp-dataStore';
import { Router } from '@angular/router';
import { Header } from '../../shared/services/header';
import { UUID } from '../../shared/services/uuid';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { VenueCategory } from '../venue-category/venue-category';
import { Locality } from '../locality/locality';
import { Company } from '../company/company';
import { environment } from '../../../environments/environment';
import { LogService } from '../../shared/services/log.service';
import { ScreenAccessService } from '../../shared/services/screen-access.service';

export class CompanyIdRequest {
  header: Header;
  companyId: number;
  constructor() { }
}
@Component({
  selector: 'app-venue',
  templateUrl: './venue.component.html',
  styleUrls: ['./venue.component.scss']
})
export class VenueComponent implements OnInit {

  ioObjArray: Venue[] = [];
  errorMessage: string = '';
  dialogRef;
  companyId: number;
  currentUser: any;
  deletedialogRef;
  isLoading: boolean = true;
  operationAccessMap = new Map();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['venueName', 'companyName','venueCategory', 'locality',  'active', 'action'];

  constructor(private restService: RestService,
    public dialog: MatDialog, public router: Router,
    public tempDataService: TempDataService, private screenAccess: ScreenAccessService,
    public snackBar: MatSnackBar, private log: LogService) {

  }


  /* On load pagenation Event*/
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.companyId = this.currentUser.companyId;
    this.getSpecificVenuefOfCompany();
    this.screenAccess.loadOperationsAccessForScreen('Zone Management', 'Venue');
    this.operationAccessMap = this.screenAccess.map;
  }



  editdata(data: any) {
    this.log.info("DATA=====" + JSON.stringify(data));
    this.log.info(JSON.stringify(data));
    this.tempDataService.changeSelecedData(data);
    return true;
  }

  venueNavigation(object: any) {
    this.log.info("DATA=====" + JSON.stringify(object));
    localStorage.setItem('venue', JSON.stringify(object));
    this.router.navigate(["/view-venue"]);
    return true;
  }

  private getSpecificVenuefOfCompany() {
    if(this.companyId!=null && this.companyId!= undefined) {
      if(this.companyId == -999) {
        this.getAllVenueDetails();
      } else {
        this.getVenueByCompanyId(this.companyId);
      }
    }
  }

  private getVenueByCompanyId(companyId:number ) {
    let header = new Header(UUID.UUID());
    let venue = <Venue>({});
    venue.header = header;
    venue.companyId = companyId;
    this.restService.post(venue, environment.getAllVenueByCompanyPath)
    .map((venueResponse: any) => {
      let result: Array<Venue> = [];
      if (venueResponse) {
        this.isLoading = false;
        venueResponse.venues.forEach(erg => {
          let venue = new Venue(erg.companyId, erg.venueName,
            erg.localityId, erg.venueCategoryId,
            erg.landMark, erg.synopsis, erg.latitude, erg.longitude,
            erg.addressLine1, erg.addressLine2, erg.venueShowTermsFileId, erg.venueShowTermmsFlag, erg.vendorPercentage, erg.accountNumber);

          venue.venueId = erg.venueId;
          venue.active = erg.active;
          venue.foodAndBreverage = erg.foodAndBreverage;
          venue.mobileTicket = erg.mobileTicket;
          venue.defaultDaysToPublish = erg.defaultDaysToPublish;
          venue.additionalFare3d = erg.additionalFare3d;
          let locality = <Locality>({});
          locality.localityId = erg.locality.localityId;
          locality.localityName = erg.locality.localityName;
          locality.pinCode = erg.locality.pinCode;
          locality.state = erg.locality.state;
          locality.country = erg.locality.country;
          locality.zoneId = erg.locality.zoneId;
          locality.landMark = erg.locality.landMark;
          venue.locality = locality;

          let venueCategory = <VenueCategory>({});
          venueCategory.venueCategoryId = erg.venueCategory.venueCategoryId;
          venueCategory.venueCategoryName = erg.venueCategory.venueCategoryName;
          venueCategory.synopsis = erg.venueCategory.synopsis;

          venue.venueCategory = venueCategory;

          let company = <Company>({});
          company.companyId = erg.company.companyId;
          company.companyName = erg.company.companyName;

          venue.company = company;

          result.push(venue);

        });
      }
      return result;
    })
    .subscribe(result => {
      this.dataSource = new MatTableDataSource(result);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, err => {

    });

  }

  private getAllVenueDetails() {
    let header = new Header(UUID.UUID());
    let venue = <Venue>({});
    venue.header = header;

    this.restService.post(venue, environment.viewAllVenuePath)
      .map((venueResponse: any) => {
        let result: Array<Venue> = [];
        if (venueResponse) {
          this.isLoading = false;
          venueResponse.venues.forEach(erg => {
            let venue = new Venue(erg.companyId, erg.venueName,
              erg.localityId, erg.venueCategoryId,
              erg.landMark, erg.synopsis, erg.latitude, erg.longitude,
              erg.addressLine1, erg.addressLine2, erg.venueShowTermsFileId, erg.venueShowTermmsFlag, erg.vendorPercentage, erg.accountNumber);

            venue.venueId = erg.venueId;
            venue.active = erg.active;
            venue.foodAndBreverage = erg.foodAndBreverage;
            venue.mobileTicket = erg.mobileTicket;
            venue.defaultDaysToPublish = erg.defaultDaysToPublish;
            venue.additionalFare3d = erg.additionalFare3d;
            let locality = <Locality>({});
            locality.localityId = erg.locality.localityId;
            locality.localityName = erg.locality.localityName;
            locality.pinCode = erg.locality.pinCode;
            locality.state = erg.locality.state;
            locality.country = erg.locality.country;
            locality.zoneId = erg.locality.zoneId;
            locality.landMark = erg.locality.landMark;
            venue.locality = locality;

            let venueCategory = <VenueCategory>({});
            venueCategory.venueCategoryId = erg.venueCategory.venueCategoryId;
            venueCategory.venueCategoryName = erg.venueCategory.venueCategoryName;
            venueCategory.synopsis = erg.venueCategory.synopsis;

            venue.venueCategory = venueCategory;

            let company = <Company>({});
            company.companyId = erg.company.companyId;
            company.companyName = erg.company.companyName;

            venue.company = company;

            result.push(venue);

          });
        }
        return result;
      })
      .subscribe(result => {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },);
  }

  /* Delete details**/

  delete(venue: Venue) {
    if (!venue.active) {
      this.openSnackBar(venue.venueName, "Venue is Disable");
    } else {
      this.deletedialogRef = this.dialog.open(YesOrNoDialogComponent, {

        disableClose: true
      });
      this.deletedialogRef.afterClosed().subscribe(result => {
        this.log.info("after closed:result");
        this.log.info(result);
        if (result === true) {
          let header = new Header(UUID.UUID());

          venue.header = header;
          this.deleteDetail(venue);

        } else {

        }
      });
      this.deletedialogRef.componentInstance.modal_name = "DELETE ACCOUNT"
    }
  }

  private deleteDetail(data: any) {
    let venueName: string;
    venueName = data.venueName;
    this.restService.post(data, environment.deleteVenuePath)
      .map((companies: any) => {
        let result: Array<Venue> = [];
        if (Venue instanceof Array) {
          companies.forEach((erg) => {
            this.log.info("Delete===");
            result.push(
              new Venue(erg.companyId, erg.venueName,
                erg.localityId, erg.venueCategoryId,
                erg.landMark, erg.synopsis, erg.latitude, erg.longitude,
                erg.addressLine1, erg.addressLine2, erg.venueShowTermsFileId, erg.venueShowTermmsFlag,
                erg.vendorPercentage, erg.accountNumber)
            );

          });
          return result;

        } else {
          this.log.info("===============" + companies.status["statusCode"]);
          if (companies.status.statusCode == '1001') {

            this.openSnackBar(venueName, "Deleted Successfully");
            this.getSpecificVenuefOfCompany();
            this.log.info("--------------" + companies.status.statusCode);

          } else if (companies.status.statusCode == '1004') {
            this.openSnackBar("Data Constraint Error", companies.status.statusDescription);
          }
        }

      })
      .subscribe(companies => this.ioObjArray = companies);
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue;
}


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  myErrorStateMatcher(): boolean {
    return true;
  }

}
