import { Component, OnInit } from '@angular/core';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Header } from '../../../shared/services/header';
import { VenueCategory } from '../venue-category';
import { UUID } from '../../../shared/services/uuid';
import { Locality } from '../locality';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Venue } from '../venue';
import { VenueResponse } from '../venue-response';
import { Company } from '../../company/company';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CompanyIdRequest } from '../venue.component';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { Status } from '../../../shared/model/response-status-model';
import { TokenStorage } from '../../../shared/guard/token-storage';

export class AutoCompleteMap {
  constructor(public name: string, public id: number) { }
}
@Component({
  selector: 'app-add-venue',
  templateUrl: './add-venue.component.html',
  styleUrls: ['./add-venue.component.scss']
})
export class AddVenueComponent implements OnInit {
  selectedData: Venue;
  responseData: VenueResponse;
  venueCategoriesFormControl: FormControl;
  localitiesFormControl: FormControl;
  companyFormControl: FormControl;
  venueCategories: Array<AutoCompleteMap> = [];
  filteredVenueCategories: Observable<AutoCompleteMap[]>;
  selectedVenueCategoryData: any = AutoCompleteMap;
  localities: Array<AutoCompleteMap> = [];
  filteredLocalities: Observable<AutoCompleteMap[]>;
  selectedLocalityData: any = AutoCompleteMap;
  companyList: Array<AutoCompleteMap> = [];
  filteredCompanyList: Observable<AutoCompleteMap[]>;
  selectedCompany: any = AutoCompleteMap;
  uploadedVenueTerms: File = null;
  responseValue: any;
  recievedFileId: any = 0;
  fileTypeInvalid: boolean = false;
  uploadSuccess: boolean = false;
  venueTerm: boolean = false;
  uploadVenue: boolean = false;
  header = new Header(UUID.UUID());

  constructor(private restService: RestService, private route: ActivatedRoute,
    private router: Router, public snackBar: MatSnackBar, private log: LogService, private Http: HttpClient, private token: TokenStorage) {
    this.venueCategoriesFormControl = new FormControl();
    this.localitiesFormControl = new FormControl();
    this.companyFormControl = new FormControl();
  }

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

  ngOnInit() {
    let companyId = this.route.snapshot.paramMap.get('companyId');
    this.log.info('Company Id :: ' + companyId);
    let venue = <Venue>({
      companyId: Number(companyId), venueId: null,
      venueName: '', localityId: 0,
      venueCategoryId: 0, landMark: '',
      synopsis: '', latitude: '',
      longitude: '', addressLine1: '',
      addressLine2: '', vendorPercentage: 0,
      accountNumber: ''
    });

    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.companyId = this.currentUser.companyId;

    let companyRenderedFlag = false;
    if (companyId == null) {
      companyRenderedFlag = true;
      let companyList = this.getCompanyData();
      this.filteredCompanyList = this.companyFormControl.valueChanges
        .pipe(
          startWith<string | AutoCompleteMap>(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this.filterCompany(name) : this.companyList.slice())
        );
    }
    venue.defaultDaysToPublish = '';
    venue.companyRenderedFlag = companyRenderedFlag;
    venue.additionalFare3dBoolean = false;
    venue.foodAndBreverageAvailableBoolean = false;
    venue.mobileTicketAvailableBoolean = false;
    venue.live = true;
    this.selectedData = venue;

    let venueCategories = this.getAllVenueCategories();
    this.filteredVenueCategories = this.venueCategoriesFormControl.valueChanges
      .pipe(
        startWith<string | AutoCompleteMap>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterVenueCategory(name) : this.venueCategories.slice())
      );

    let localities = this.getAllLocalities();
    this.filteredLocalities = this.localitiesFormControl.valueChanges
      .pipe(
        startWith<string | AutoCompleteMap>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterLocalities(name) : this.localities.slice())
      );
  }

  displayFn(selectedData?: AutoCompleteMap): string | undefined {
    return selectedData ? selectedData.name : undefined;
  }

  filterLocalities(name: string): AutoCompleteMap[] {
    return this.localities.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }


  filterVenueCategory(name: string): AutoCompleteMap[] {
    return this.venueCategories.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterCompany(name: string): AutoCompleteMap[] {
    return this.companyList.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
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
        this.selectedCompany = companyList;
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
        this.selectedLocalityData = localities;    
      });
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
        this.selectedVenueCategoryData = venueCategories;
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
    if (this.selectedData.companyRenderedFlag && this.selectedCompany != null
      && this.selectedCompany != undefined) {

      this.selectedData.companyId = this.selectedCompany.id;
    }

    let validationMessage = this.validation();
    if (validationMessage == false) {
      this.save();
    } else {
      this.openSnackBar("Please fill the red marked fields", validationMessage);
    }
  }
  private save() {

    if (this.uploadedVenueTerms != null) {
      const fd = new FormData();
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
          console.log("fileId" + this.recievedFileId);
          this.saveAll();
        });
    } else {
      this.saveAll();
    }
  }
  saveAll() {
    {
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
      this.selectedData.foodAndBreverageAvailable = 0;
      if (this.selectedData.foodAndBreverageAvailableBoolean == true) {
        this.selectedData.foodAndBreverageAvailable = 1;
      }
      this.selectedData.mobileTicketAvailable = 0;
      if (this.selectedData.mobileTicketAvailableBoolean == true) {
        this.selectedData.mobileTicketAvailable = 1;
      }

      // this.selectedData.latitude = this.marker.lat+"";
      // this.selectedData.longitude = this.marker.lng+"";
      this.selectedData.latitude = '203.0344';
      this.selectedData.longitude = '300.4022';

      if (this.recievedFileId != 0) {
        this.selectedData['venueShowTermsFileId'] = this.recievedFileId;
        this.selectedData['venueShowTermsFlag'] = 'Y';
      } else {
        this.selectedData['venueShowTermsFileId'] = this.recievedFileId;
        this.selectedData['venueShowTermsFlag'] = 'N';
      }
      this.restService.post(this.selectedData, environment.addVenuePath)
        .map((res: any) => {
          this.log.info("SAVE****");
          return new Status(res.status["statusCode"], res.status["statusDescription"], res.status['transactionId']);
        })
        .subscribe(result => {
          this.log.info(JSON.stringify(result));
          if (result.statusCode == '1001') {
            this.openSnackBar(this.selectedData.venueName, "Saved Successfully");
            this.router.navigate(['/venue']);
          } else {
            this.openSnackBar(this.selectedData.venueName, result.statusDescription);
          }
        }, err => {
          var errorVal = err.status.statusDescription;
          this.openSnackBar("ERROR MSG", errorVal)
        });
    }
  }
  // Validation part 
  validation() {
    if (this.selectedData.companyId == null) {
      return 'Company is required!';
    } else if (this.selectedData.venueName == '') {
      return 'Venue Name is required!';
    } else if (this.selectedData.venueCategoryId == null) {
      return 'Venue Category is required!';
      // } else if (this.selectedData.localityId == null) {
      //   return 'Locality is required!';
      // check box validation
    }
    else if (this.uploadVenue == true && this.uploadedVenueTerms == null) {
      return 'Venue Terms required!';
    } else if (this.fileTypeInvalid == true) {
      return 'Updated file not supported';
    } else if (this.selectedData.defaultDaysToPublish == '') {
      return 'Default Days To Publish is required!';
      // } else if(this.marker.lat+"" == 'undefined'){
      //   return 'Map location is required!';
    } else {
      return false;
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  myErrorStateMatcher(): boolean {
    return true;
  }
  onFileSelected(event) {
    this.fileTypeInvalid = false;
    this.uploadedVenueTerms = <File>event.target.files[0]
    if (this.uploadedVenueTerms.type == "text/html") {
      console.log(this.uploadedVenueTerms);
      this.fileTypeInvalid = false;
      this.uploadSuccess = true;
    }
    else {
      this.fileTypeInvalid = true;
      this.uploadSuccess = false;
    }
  }

  // To delete the uploaded terms
  delete() {
    this.uploadedVenueTerms = null;
    this.fileTypeInvalid = false;
    this.uploadSuccess = false;
  }
}
// just an interface for type safety.
export class Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}