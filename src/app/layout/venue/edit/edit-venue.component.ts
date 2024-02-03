import { Component, OnInit } from '@angular/core';
import { Header } from '../../../shared/services/header';
import { VenueCategory } from '../venue-category';
import { UUID } from '../../../shared/services/uuid';
import { Locality } from '../locality';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Venue } from '../venue';
import { VenueResponse } from '../venue-response';
import { TempDataService } from '../../../shared/temp-dataStore';
import { Router } from '@angular/router';
import { RestService } from '../../../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Marker } from '../add/add-venue.component';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { CompanyIdRequest } from '../venue.component';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { Company } from '../../company/company';
import { ViewmodalComponent } from '../../../viewmodal/viewmodal.component';
import { TokenStorage } from '../../../shared/guard/token-storage';

export class AutoCompleteMap {
  constructor(public name: string, public id: number) { }
}
@Component({
  selector: 'app-edit-venue',
  templateUrl: './edit-venue.component.html',
  styleUrls: ['./edit-venue.component.scss']
})
export class EditVenueComponent implements OnInit {
  selectedData: Venue;
  responseData: VenueResponse;
  uploadedVenueTerms: File = null;
  responseValue: any;
  recievedFileId: any = 0;
  fileIdContent: any;
  uploadVenue: boolean;
  fileTypeInvalid: boolean = false;
  uploadSuccess: boolean;
  venueTermUpload: boolean = false;

  venueCategoriesFormControl: FormControl;
  localitiesFormControl: FormControl;
  companyFormControl: FormControl;
  companyList: Array<AutoCompleteMap> = [];
  filteredCompanyList: Observable<AutoCompleteMap[]>;
  selectedCompany: any = AutoCompleteMap;
  venueCategories: Array<AutoCompleteMap> = [];
  filteredVenueCategories: Observable<AutoCompleteMap[]>;
  selectedVenueCategoryData: any = AutoCompleteMap;
  localities: Array<AutoCompleteMap> = [];
  filteredLocalities: Observable<AutoCompleteMap[]>;
  selectedLocalityData: any = AutoCompleteMap;
  header = new Header(UUID.UUID());
  // google maps zoom level
  zoom: number = 6;
  // initial center position for the map
  lat: number = 20.5937;
  lng: number = 78.9629;
  marker: Marker = new Marker();
  companyId: number;
  currentUser: any;

  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`)
  }

  mapClicked($event: any) {
    this.marker.lat = $event.coords.lat;
    this.marker.lng = $event.coords.lng;
    this.marker.draggable = true;
  }

  markerDragEnd(m: Marker, $event: any) {
    console.log('dragEnd', m, $event);
    this.marker.lat = $event.coords.lat;
    this.marker.lng = $event.coords.lng;
    this.marker.draggable = true;
  }


  constructor(private tempDataService: TempDataService,
    private restService: RestService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService, public dialog: MatDialog,
    private Http: HttpClient, private token: TokenStorage) {

    this.venueCategoriesFormControl = new FormControl();
    this.localitiesFormControl = new FormControl();
    this.companyFormControl = new FormControl();
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.companyId = this.currentUser.companyId;

    this.log.info("Edit Venue" + this.tempDataService.currentSelectedData);
    this.selectedData = JSON.parse(localStorage.getItem('editVenue'));
    this.getAllVenueDetails();
    if (this.selectedData.venueShowTermsFileId != 0) {
      this.uploadVenue = true;
      this.venueTermUpload = true;
      this.recievedFileId = this.selectedData.venueShowTermsFileId;
      this.viewTerms(this.recievedFileId);
    }
    this.selectedData.live = false;
    if (this.selectedData.active == 1) {
      this.selectedData.live = true;
    }
    this.selectedData.additionalFare3dBoolean = false;
    if (this.selectedData.additionalFare3d == 1) {
      this.selectedData.additionalFare3dBoolean = true;
    }
    this.selectedData.foodAndBreverageAvailableBoolean = false;
    if (this.selectedData.foodAndBreverage == 1) {
      this.selectedData.foodAndBreverageAvailableBoolean = true;
    }
    this.selectedData.mobileTicketAvailableBoolean = false;
    if (this.selectedData.mobileTicket == 1) {
      this.selectedData.mobileTicketAvailableBoolean = true;
    }
    this.marker.lat = Number(this.selectedData.latitude);
    this.marker.lng = Number(this.selectedData.longitude);
    this.lat = this.marker.lat;
    this.lng = this.marker.lng;
    this.marker.draggable = true;
    this.getCompanyData();
    this.filteredCompanyList = this.companyFormControl.valueChanges
      .pipe(
        startWith<string | AutoCompleteMap>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterCompany(name) : this.companyList.slice())
      );
    this.getAllVenueCategories();
    this.filteredVenueCategories = this.venueCategoriesFormControl.valueChanges
      .pipe(
        startWith<string | AutoCompleteMap>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterVenueCategory(name) : this.venueCategories.slice())
      );
    this.getAllLocalities();
    this.filteredLocalities = this.localitiesFormControl.valueChanges
      .pipe(
        startWith<string | AutoCompleteMap>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterLocalities(name) : this.localities.slice())
      );
    if (this.selectedData.venueCategory != null && this.venueCategories != undefined) {
      let venueCategoriesMap = new AutoCompleteMap(this.selectedData.venueCategory.venueCategoryName,
        this.selectedData.venueCategory.venueCategoryId);
      this.selectedVenueCategoryData = venueCategoriesMap;
    }
    if (this.selectedData.company != null && this.companyList != undefined) {
      let company = new AutoCompleteMap(this.selectedData.company.companyName,
        this.selectedData.company.companyId);
      this.selectedCompany = company;
    }
    if (this.selectedData.locality != null && this.localities != undefined) {
      let locality = new AutoCompleteMap(this.selectedData.locality.localityName,
        this.selectedData.locality.localityId);
      this.selectedLocalityData = locality;
    }
  }

  displayFn(selectedData?: AutoCompleteMap): string | undefined {
    return selectedData ? selectedData.name : undefined;
  }

  filterLocalities(name: string): AutoCompleteMap[] {
    return this.localities.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  filterCompany(name: string): AutoCompleteMap[] {
    return this.companyList.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  filterVenueCategory(name: string): AutoCompleteMap[] {
    return this.venueCategories.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  private addScreen() {
    this.router.navigate(['/add-screen',
      { venueId: this.selectedData.venueId, skipLocationChange: true }]);
    return true;
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
    .map((companyObj: any) => {
      if (companyObj) {
        companyObj.companies.forEach((erg) => {
          this.companyList.push(new AutoCompleteMap(erg.companyName, erg.companyId));
        });
      }
      return this.companyList;
    })
    .subscribe(companyList => {
      this.selectedCompany = companyList;
    }, err => { });
  }
  private getAllCompanyDetails() {
    let header = new Header(UUID.UUID());
    let company = <Company>({});
    company.header = header;
    this.restService.post(company, environment.viewCompanyPath)
      .map((companyObj: any) => {
        if (companyObj) {
          companyObj.companies.forEach((erg) => {
            this.companyList.push(new AutoCompleteMap(erg.companyName, erg.companyId));
          });
        }
        return this.companyList;
      })
      .subscribe(companyList => {
      }, err => { });
  }

  private getAllLocalities() {
    let header = new Header(UUID.UUID());
    let locality = <Locality>({});
    locality.header = header;
    this.restService.get(environment.getAllLocalityPath)
      .map((localityObj: any) => {
        if (localityObj) {
          localityObj.forEach((erg) => {
            this.localities.push(new AutoCompleteMap(erg.locality_name, erg.locality_id));
          });
        }
        return this.localities;
      }).subscribe(localities => {
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
          // this.isLoading = false;
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
            // venue.locality = locality;        
          })
        }
      })
  }


  private getAllVenueCategories() {
    let header = new Header(UUID.UUID());
    let venueCategory = <VenueCategory>({});
    venueCategory.header = header;
    this.restService.post(venueCategory, environment.getAllVenueCategoryPath)
      .map((venueCatObj: any) => {
        if (venueCatObj) {
          venueCatObj.venueCategories.forEach((erg) => {
            this.venueCategories.push(new AutoCompleteMap(erg.venueCategoryName, erg.venueCategoryId));
          });
        }
        return this.venueCategories;
      }).subscribe(venueCategories => {
      });
  }

  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");
    if (this.selectedVenueCategoryData != null && this.selectedVenueCategoryData != undefined) {
      this.selectedData.venueCategoryId = this.selectedVenueCategoryData.id;
    }
    if (this.selectedLocalityData != null && this.selectedLocalityData != undefined) {
      this.selectedData.localityId = this.selectedLocalityData.id;
    }
    let validationMessage = this.validation();
    if (validationMessage == false) {
      this.save();
    } else {
      this.openSnackBar("Please fill the red marked fields", validationMessage);
    }
  }
  private save() {
    if (this.uploadedVenueTerms != null && this.uploadVenue == true) {
      const fd = new FormData();
      console.log(this.uploadedVenueTerms);
      fd.append('file', this.uploadedVenueTerms, this.uploadedVenueTerms.name);
      const httpOptions = {
        headers: new HttpHeaders({
          "Authorization": "Bearer " + this.token.getToken()
        })
      };
      const url = `${environment.baseUrl}${environment.fileUploadService}`;
      this.Http.post(url + 'venue', fd, httpOptions)
        .subscribe(res => {
          this.responseValue = res;
          console.log(this.responseValue);
          this.recievedFileId = this.responseValue.fileId;
          console.log('fileId' + this.recievedFileId);
          this.saveAll();
        });
    } else {
      this.saveAll();
    }
  }
  saveAll() {
    let header = new Header(UUID.UUID());
    this.selectedData.header = header;
    this.selectedData.active = 0;
    if (this.selectedData.live == true) {
      this.selectedData.active = 1;
    }
    this.selectedData.additionalFare3d = 0;
    if (this.selectedData.additionalFare3dBoolean == true) {
      this.selectedData.additionalFare3d = 1;
    }
    this.selectedData.foodAndBreverage = 0;
    if (this.selectedData.foodAndBreverageAvailableBoolean == true) {
      this.selectedData.foodAndBreverage = 1;
    }
    this.selectedData.mobileTicket = 0;
    if (this.selectedData.mobileTicketAvailableBoolean == true) {
      this.selectedData.mobileTicket = 1;
    }
    this.selectedData.companyId = this.selectedCompany.id;
    this.selectedData.localityId = this.selectedLocalityData.id;
    this.selectedData.venueCategoryId = this.selectedVenueCategoryData.id;

    this.selectedData.latitude = this.marker.lat + "";
    this.selectedData.longitude = this.marker.lng + "";
    if (this.recievedFileId != 0 && this.uploadVenue == true) {
      this.selectedData.venueShowTermsFileId = this.recievedFileId;
      this.selectedData.venueShowTermsFlag = 'Y';
    } else {
      this.selectedData.venueShowTermsFileId = 0;
      this.selectedData.venueShowTermsFlag = 'N';
    }

    this.restService.post(this.selectedData, environment.updateVenuePath)
      .map((venue: any) => {
        this.log.info("SAVE****");
        let result: VenueResponse;
        result = new VenueResponse(venue.status["statusCode"], venue.status["statusCode"],
          venue.status["transactionId"]);
        return result;
      })
      .subscribe(result => {
        this.log.info("inside response" + result.statusCode + "" + result.statusDescription);
        this.log.info(JSON.stringify(result));
        this.responseData = result;
        this.log.info(this.responseData);
        if (this.responseData.statusCode == '1001') {
          this.openSnackBar(this.selectedData.venueName, "Saved Successfully");
          this.log.info("--------------" + this.responseData.statusCode);
          this.router.navigate(['/venue']);

        } else if (this.responseData.statusCode == '1002') {

          this.openSnackBar(this.responseData.statusDescription, this.selectedData.venueName);
        } else if (this.responseData.statusCode == '4001') {

          this.openSnackBar(this.responseData.statusDescription, this.selectedData.venueName);
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }
  // Validation part 
  validation() {
    if (this.selectedCompany.id == '') {
      return 'Company is required!';
    } else if (this.selectedData.venueName == '') {
      return 'Venue Name is required!';
    } else if (this.selectedVenueCategoryData.id == '') {
      return 'Venue Category is required!';
    } else if (this.fileTypeInvalid == true) {
      return 'Updated file not supported';
    } else if (this.uploadVenue == true && this.venueTermUpload == false) {
      return 'Venue Terms required!';
    } else if (this.selectedLocalityData.id == '') {
      return 'Locality is required!';
    } else if (this.selectedData.defaultDaysToPublish == '') {
      return 'Default Days To Publish is required!';
    } else {
      return false;
    }
  }
  viewTerms(fileId) {
    this.recievedFileId = fileId;
    this.restService.get(environment.fileIdContent + fileId)
      .subscribe(response => {
        console.log(response);
        this.fileIdContent = response;
        console.log(this.fileIdContent.content);
        localStorage.setItem('movieTerms', JSON.stringify(this.fileIdContent.content));
      });
  }
  openDialog() {
    let dialogRef = this.dialog.open(ViewmodalComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`result: ${result}`);
    });
  }
  onFileSelected(event) {
    this.fileTypeInvalid = false;  // this.uploadedVenueTerms = <File>event.target.files[0]
    this.uploadedVenueTerms = <File>event.target.files[0]
    if (this.uploadedVenueTerms.type == "text/html") {
      console.log(this.uploadedVenueTerms);
      this.fileTypeInvalid = false;
      this.venueTermUpload = true;
      this.uploadSuccess = true;
    }
    else {
      this.fileTypeInvalid = true;
      this.uploadSuccess = false;
    }
  }
  delete() {
    this.uploadedVenueTerms = null;
    this.venueTermUpload = false;
    this.uploadSuccess = false;
    this.fileTypeInvalid = false;
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
