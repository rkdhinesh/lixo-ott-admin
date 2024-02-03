import { Component, OnInit, ViewChild } from "@angular/core";
import { Header } from "../../../shared/services/header";
import { VenueCategory } from "../venue-category";
import { UUID } from "../../../shared/services/uuid";
import { Locality } from "../locality";
import { Observable } from "rxjs";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { Venue } from "../venue";
import{Screen} from "../../publish/screen";
import { YesOrNoDialogComponent } from  "../../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent";
import { VenueResponse } from "../venue-response";
import { TempDataService } from "../../../shared/temp-dataStore";
import { ActivatedRoute, Router } from "@angular/router";
import { RestService } from "../../../api.service";
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AutoCompleteMap } from "../edit/edit-venue.component";
import { CompanyIdRequest } from "../venue.component";
import { environment } from "../../../../environments/environment";
import { LogService } from "../../..//shared/services/log.service";
import { Company } from "../../company/company";
import { ScreenModel } from "../../../shared/model/screen-model";
import { PublishResponse } from "../../publish/publishResponse";
import { ViewmodalComponent } from "../../../viewmodal/viewmodal.component";
import { Data } from "../../../shared/data";
import { ScreenAccessService } from "../../../shared/services/screen-access.service";

export class ScreenDelete {
  header: Header;
  screenId: number;
  venueId: number;
}
@Component({
  selector: "app-view-venue",
  templateUrl: "./view-venue.component.html",
  styleUrls: ["./view-venue.component.scss"]
})
export class ViewVenueComponent implements OnInit {
  selectedData: Venue;
  responseData: VenueResponse;
  venueCategoriesFormControl: FormControl;
  active:number;
  localitiesFormControl: FormControl;
  companyFormControl: FormControl;
  header: Header;
  operationAccessMap = new Map();
  companyList: Array<AutoCompleteMap> = [];
  filteredCompanyList: Observable<AutoCompleteMap[]>;
  selectedCompany: any = AutoCompleteMap;
  venueCategories: Array<AutoCompleteMap> = [];
  filteredVenueCategories: Observable<AutoCompleteMap[]>;
  selectedVenueCategoryData: any = AutoCompleteMap;
  localities: Array<AutoCompleteMap> = [];
  filteredLocalities: Observable<AutoCompleteMap[]>;
  selectedLocalityData: any = AutoCompleteMap;
  screens: ScreenModel[] = [];
  fileIdContent: any;
  uploadVenue: boolean;
  deletedialogRef;
  venueTermUpload: boolean = false;
  recievedFileId: any = 0;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ["screen", "action"];
  uploadedVenueTerms: boolean;
  headers = new Header(UUID.UUID());
  companyId: number;
  currentUser: any;
  constructor(
    private store: Data,
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private log: LogService,
    public dialog: MatDialog,
    private screenAccess: ScreenAccessService
  ) {
    this.venueCategoriesFormControl = new FormControl();
    this.localitiesFormControl = new FormControl();
    this.companyFormControl = new FormControl();
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.companyId = this.currentUser.companyId;

    this.selectedData = JSON.parse(localStorage.getItem("venue"));
    this.operationAccessMap = this.screenAccess.map;
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

    this.getCompanyData();
    this.filteredCompanyList = this.companyFormControl.valueChanges.pipe(
      startWith<string | AutoCompleteMap>(""),
      map(value => (typeof value === "string" ? value : value.name)),
      map(name => (name ? this.filterCompany(name) : this.companyList.slice()))
    );

    this.getAllVenueCategories();
    this.filteredVenueCategories = this.venueCategoriesFormControl.valueChanges.pipe(
      startWith<string | AutoCompleteMap>(""),
      map(value => (typeof value === "string" ? value : value.name)),
      map(name =>
        name ? this.filterVenueCategory(name) : this.venueCategories.slice()
      )
    );
    this.getAllLocalities();
    this.filteredLocalities = this.localitiesFormControl.valueChanges.pipe(
      startWith<string | AutoCompleteMap>(""),
      map(value => (typeof value === "string" ? value : value.name)),
      map(name =>
        name ? this.filterLocalities(name) : this.localities.slice()
      )
    );
    if (
      this.selectedData.venueCategory != null &&
      this.venueCategories != undefined
    ) {
      let venueCategoriesMap = new AutoCompleteMap(
        this.selectedData.venueCategory.venueCategoryName,
        this.selectedData.venueCategory.venueCategoryId
      );
      this.selectedVenueCategoryData = venueCategoriesMap;
    }
    if (this.selectedData.company != null && this.companyList != undefined) {
      let company = new AutoCompleteMap(
        this.selectedData.company.companyName,
        this.selectedData.company.companyId
      );
      this.selectedCompany = company;
    }
    if (this.selectedData.locality != null && this.localities != undefined) {
      let locality = new AutoCompleteMap(
        this.selectedData.locality.localityName,
        this.selectedData.locality.localityId
      );
      this.selectedLocalityData = locality;
    }
    this.getAllScreenDetails(this.selectedData.venueId);

    if (this.selectedData.venueShowTermsFileId != 0) {
      this.uploadVenue = true;
      this.venueTermUpload = true;
      this.recievedFileId = this.selectedData.venueShowTermsFileId;
      this.viewTerms(this.recievedFileId);
    }
  }

  displayFn(selectedData?: AutoCompleteMap): string | undefined {
    return selectedData ? selectedData.name : undefined;
  }

  filterLocalities(name: string): AutoCompleteMap[] {
    return this.localities.filter(
      option => option.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }
  filterCompany(name: string): AutoCompleteMap[] {
    return this.companyList.filter(
      option => option.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }
  filterVenueCategory(name: string): AutoCompleteMap[] {
    return this.venueCategories.filter(
      option => option.name.toLowerCase().indexOf(name.toLowerCase()) === 0
    );
  }

  private addScreen() {
    this.router.navigate([
      "/add-screen",
      { venueId: this.selectedData.venueId, skipLocationChange: true }
    ]);
    return true;
  }

  private getAllScreenDetails(venueId: number) {
    this.screens = [];
    let header = new Header(UUID.UUID());
    let screen = <ScreenModel>{};
    screen.header = header;
    screen.venueId = venueId;
    this.restService
      .post(screen, environment.viewAllScreenPath)
      .map((screenResponse: any) => {
        let result: Array<ScreenModel> = [];
        if (screenResponse) {
          screenResponse.screens.forEach(erg => {
            let screenModel = new ScreenModel();
            screenModel.screenId = erg.screenId;
            screenModel.screenName = erg.screenName;
            screenModel.venueId = venueId;
            screenModel.dimension = erg.dimension;
            screenModel.synopsis = erg.synopsis;
            screenModel.live = false;
            if (erg.active == 1) {
              screenModel.live = true;
            }
            this.screens.push(screenModel);
            result.push(screenModel);
          });
          return result;
        }
      })
      .subscribe(
        result => {
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        err => { }
      );
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
    companyRequest.header = this.headers;
    companyRequest.companyId = companyId;
    this.restService.post(companyRequest, environment.getParticularCompany)
    .map((res: any) => {
      if (res) {
        res.companies.forEach(erg => {
          this.companyList.push(
            new AutoCompleteMap(erg.companyId, erg.companyName)
          );
        });
      }
    })
    .subscribe(
      companyList => { },
      err => { }
    );
  }
  private getAllCompanyDetails() {
    let header = new Header(UUID.UUID());
    let company = <Company>{};
    company.header = header;

    this.restService
      .post(company, environment.viewCompanyPath)
      .map((companyObj: any) => {
        if (companyObj) {
          companyObj.companies.forEach(erg => {
            this.companyList.push(
              new AutoCompleteMap(erg.companyName, erg.companyId)
            );
          });
        }
        return this.companyList;
      })
      .subscribe(
        companyList => { },
        err => { }
      );
  }

  private getAllLocalities() {
    let header = new Header(UUID.UUID());
    let locality = <Locality>{};
    locality.header = header;
    this.restService
      .get(environment.getAllLocalityPath)
      .map((localityObj: any) => {
        if (localityObj) {
          localityObj.forEach(erg => {
            this.localities.push(
              new AutoCompleteMap(erg.locality_name, erg.locality_id)
            );
          });
        }
        return this.localities;
      })
      .subscribe(localities => { });
  }

  private getAllVenueCategories() {
    let header = new Header(UUID.UUID());
    let venueCategory = <VenueCategory>{};
    venueCategory.header = header;
    this.restService
      .post(venueCategory, environment.getAllVenueCategoryPath)
      .map((venueCatObj: any) => {
        if (venueCatObj) {
          venueCatObj.venueCategories.forEach(erg => {
            this.venueCategories.push(
              new AutoCompleteMap(erg.venueCategoryName, erg.venueCategoryId)
            );
          });
        }
        return this.venueCategories;
      })
      .subscribe(venueCategories => { });
  }

  seatLayoutNavigation(data: any) {
    this.store.storage = JSON.stringify(data);
    //this.tempDataService.changeSelecedData(data);
    localStorage.setItem("screen", JSON.stringify(data));
    this.router.navigate(["/seat-layout"]);
    return true;
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
  delete(screenDetails){  
 
    this.deletedialogRef = this.dialog.open(YesOrNoDialogComponent, {
      disableClose: true
    });
    this.deletedialogRef.afterClosed().subscribe(result => {
      this.log.info("after closed:result");
      this.log.info(result);
      if (result === true) {
       
        this.removeScreen(screenDetails);

      } else {
      }
    });
    this.deletedialogRef.componentInstance.modal_name = "DELETE ACCOUNT"
  }
  
  
  
  
  removeScreen(data: any) {
    debugger;
    let deleteScreenRequest = <ScreenDelete>{};
    this.header = new Header(UUID.UUID());
    deleteScreenRequest.header = this.header;
    deleteScreenRequest.screenId = data.screenId;
    deleteScreenRequest.venueId = data.venueId;
    this.restService
      .post(deleteScreenRequest, environment.deleteScreenPath)
      .map((publish: any) => {
        let result: PublishResponse;
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
        if ((result.statusCode = "1001")) {
          this.openSnackBar("Screen Deleted Successfully", "success");
          this.router.navigate(["/venue"]);
        } else {
          this.openSnackBar(result.statusDescription, "success");
        }
      });
  }
  openDialog() {
    let dialogRef = this.dialog.open(ViewmodalComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(`result: ${result}`);
    });
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
}
