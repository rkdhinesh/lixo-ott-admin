import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatRadioChange } from "@angular/material/radio";
import { DatePipe } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { AddUserId } from "./adduserid";
import { Header } from "../../../shared/services/header";
import { UUID } from "../../../shared/services/uuid";
import { RoleHeader } from "../../../shared/services/role-header";
import { RestService } from "../../../api.service";
import { LogService } from "../../../shared/services/log.service";
import { environment } from "../../../../environments/environment";
import { UserResponse } from "../../publish/userresponse";
import { PublishResponse } from "../../publish/publishResponse";
import { CompanyVenueRequest } from "../../company/view-company/view-company.component";
import { AddUserHeader } from "../../../shared/services/add-user-header";
import { TempDataService } from "../../../shared/temp-dataStore";

export class AddUserRoleRequestHeader {
  header = new AddUserHeader(UUID.UUID());
  loginType = Header;
  constructor() { }
}

export class DropDownModel {
  id: number;
  name: string;
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class AddUser {
  userId: string;
  roleId: string;
  companyId: string;
  systemId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  profileImageUrl: string;
  primaryEmail: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber: string;
  alternativeEmailId: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  marriageDate: string;
  venueDetails: any;
  header: AddUserHeader;

}
export class CompanyIdRequest {
  header: Header;
  companyId: number;
  constructor() { }
}
@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"]
})
export class AddUserComponent implements OnInit {
  selectedData: AddUser;
  selectedType: Array<string>;
  roleList: DropDownModel[] = [];
  selectedRole: DropDownModel;
  companyList: DropDownModel[] = [];
  selectedCompany: DropDownModel;
  venueList: DropDownModel[] = [];
  userIds = new AddUserId();
  roleHeader = new RoleHeader();

  @Input()
  name: string;
  dateOfBirth: string;
  marriageDate: string;
  header = new Header(UUID.UUID());
  adduserheader=new AddUserHeader(UUID.UUID());
  gender: any;
  venueOptions = [];
  selectedVenueOptions = [];

  selectedVenue = this.selectedVenueOptions;
  showError = false;
  errorMessage = "";
  companyId: number;
  currentUser: any;

  getSelectedVenueOptions(selected) {
    this.selectedVenue = selected;
  }

  onResetSelection() {
    this.selectedVenueOptions = [];
  }

  constructor(
    private company: TempDataService,
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private log: LogService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    let user = <AddUser>{
      userId: "",
      roleId: "",
      companyId: "",
      systemId: this.userIds.systemId,
      firstName: "",
      lastName: "",
      middleName: "",
      profileImageUrl: "",
      primaryEmail: "",
      primaryPhoneNumber: "",
      alternativeEmailId: "",
      gender: "",
      dateOfBirth: "",
      maritalStatus: "",
      marriageDate: "",
    };
    this.selectedData = user;
    this.getAllRoles();
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.companyId = this.currentUser.companyId;
    this.getCompanyData();
    this.selectedType = ['Male', 'Female'];
  }
  // Change Radio button
  radioChange(event: MatRadioChange) {
    console.log(event.value);
    localStorage.setItem('gendertype', event.value);
  }
  public addUserInfo() {
    let gender = localStorage.getItem('gendertype');
    this.selectedData.gender = gender;
    this.log.info("Gender::::::" + this.selectedData.gender);
    this.selectedData.header = this.adduserheader;
    this.selectedData.roleId = this.selectedRole.id + "";
    this.selectedData.companyId = this.selectedCompany.id + "";
    this.selectedData.dateOfBirth =
      this.datePipe.transform(this.dateOfBirth, "dd-MMM-yyyy", 'en-US');
    this.selectedData.marriageDate =
      this.datePipe.transform(this.marriageDate, "dd-MMM-yyyy", 'en-US');
    const baseUrl = `${environment.baseUrl}` + environment.addUserPath;
    this.http
      .post(baseUrl, this.selectedData, this.roleHeader)
      .map((response: any) => {
        let result: UserResponse;
        result = new PublishResponse(
          response.status["statusCode"],
          response.status["statusDescription"],
          response.status["transactionId"]
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
        if ((result.statusCode == "2001")) {
          this.openSnackBar("Successfully Saved", "success");
          this.router.navigate(["/user-role"]);
        } else if ((result.statusCode == "1002") || (result.statusCode == "3002")) {
          this.openSnackBar(result.statusDescription, "error");
        }
      });
  }

  private getAllRoles() {
    this.roleList = [];

    let request = new AddUserRoleRequestHeader();
    request.header = this.adduserheader;
    this.restService
      .post(request, environment.getAllRolePath)
      .map((res: any) => {
        if (res) {
          res.roles.forEach(erg => {
            this.roleList.push(new DropDownModel(erg.roleId, erg.roleName));
          });
        }
      }).subscribe(result => { },
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
    companyRequest.header = this.header;
    companyRequest.companyId = companyId;
    this.restService.post(companyRequest, environment.getParticularCompany)
    .map((res: any) => {
      if (res) {
        res.companies.forEach(erg => {
          this.companyList.push(
            new DropDownModel(erg.companyId, erg.companyName)
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
    this.companyList = [];

    let request = new AddUserRoleRequestHeader();
    request.header = this.header;
    this.restService
      .post(request, environment.viewCompanyPath)
      .map((res: any) => {
        if (res) {
          res.companies.forEach(erg => {
            this.companyList.push(
              new DropDownModel(erg.companyId, erg.companyName)
            );
          });
        }
      })
      .subscribe(result => {

      });
  }

  getAllVenueBaesdOnCompany() {
    this.venueOptions = [];
    this.selectedVenue = [];
    this.onResetSelection();
    let venueRequest = <CompanyVenueRequest>{};
    venueRequest.companyId = this.selectedCompany.id;
    venueRequest.header = this.header;
    this.restService
      .post(venueRequest, environment.getAllVenueByCompanyPath)
      .map((res: any) => {
        if (res) {
          res.venues.forEach(erg => {
            this.venueOptions.push({
              display: erg.venueName,
              value: erg.venueId
            });
          });
        }
      })
      .subscribe(
        venueList => { },
        err => { }
      );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
}
