import { Component, OnInit, ViewChild } from '@angular/core';
import { Company } from '../company';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UUID } from '../../../shared/services/uuid';
import { Header } from '../../../shared/services/header';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';
import { Venue } from '../../venue/venue';
import { Locality } from '../../locality/locality';
import { VenueCategory } from '../../venue/venue-category'; 
import { Data } from '../../../shared/data';
import { YesOrNoDialogComponent } from '../../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';

export class CompanyVenueRequest {
  header: Header;
  companyId: number;
  constructor() { }
}
@Component({
  selector: 'app-view-company',
  templateUrl: './view-company.component.html',
  styleUrls: ['./view-company.component.scss']
})
export class ViewCompanyComponent implements OnInit {
  header = new Header(UUID.UUID());
  venueList: Venue[];
  data: any;
  selectedData: Company;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['venue', 'action'];
  ioObjArray: Venue[] = [];
  isLoading: boolean = true;
  deletedialogRef;
  zoom: number = 8;
  venue = Venue;
  venueActive: boolean;
  // initial center position for the map
  lat: number = 9.95309442908996;
  lng: number = 78.09735072048466;
  selectedVenue = Venue;
  constructor(private tempDataService: TempDataService, private store: Data,
    private restService: RestService, public dialog: MatDialog,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {
  }

  ngOnInit() {
    this.log.info("View" + this.tempDataService.currentSelectedData);
    this.tempDataService.currentSelectedData.subscribe(selectedData => this.selectedData = selectedData);
    // Load Venue Information
    this.getAllVenueBaesdOnCompany(this.selectedData.companyId);
  }

  private getAllVenueBaesdOnCompany(companyid: number) {
    this.venueList = [];
    let venueRequest = <CompanyVenueRequest>({})
    venueRequest.companyId = companyid;
    venueRequest.header = this.header;
    this.restService.post(venueRequest, environment.getAllVenueByCompanyPath)
      .map((company: any) => {
        let result: Array<Venue> = [];
        if (company) {
          company.venues.forEach(erg => {
            let venue = new Venue(erg.companyId, erg.venueName,
              erg.localityId, erg.venueCategoryId,
              erg.landMark, erg.synopsis, erg.latitude, erg.longitude,
              erg.addressLine1, erg.addressLine2, erg.venueShowTermsFileId, erg.venueShowTermsFlag,
              erg.vendorPercentage, erg.accountNumber);
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
            this.venueList.push(venue);
            result.push(venue);
          });
          return result;
        }
      }).subscribe(result => {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      }, err => {
      });
  }

  editdata(data: any) {
    this.log.info(JSON.stringify(data));
    this.tempDataService.changeSelecedData(data);
    this.selectedVenue = JSON.parse(localStorage.getItem('editVenue'));
    this.router.navigate(["/venue/edit-venue"]);
    return true;
  }


  venueNavigation(object: any) {
    this.store.storage = JSON.stringify(object);
    localStorage.setItem('venue', JSON.stringify(object));
    this.router.navigate(["/view-venue"]);
    return true;
  }

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
          if (companies.status.statusCode == '1001') {
            this.openSnackBar(venueName, "Venue is Disabled");
            this.getAllVenueBaesdOnCompany(this.selectedData.companyId);
          } else if (companies.status.statusCode == '1004') {
            this.openSnackBar("Data Constraint Error", companies.status.statusDescription);
          }
        }
      })
      .subscribe(companies => this.ioObjArray = companies);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
