import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TempDataService } from "../../../shared/temp-dataStore";
import { RestService } from "../../../api.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LogService } from "../../../shared/services/log.service";
import { UUID } from "../../../shared/services/uuid";
import { environment } from "../../../../environments/environment";
import { PublishResponse } from "../../../layout/publish/publishResponse";
import { DatePipe, formatDate } from "@angular/common";
import { Header } from "../../../shared/services/header";
import { CompanyVenueRequest } from "../../../layout/company/view-company/view-company.component";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserResponse } from "../../../layout/publish/userresponse";
import { RoleHeader } from "../../../shared/services/role-header";

export class AddRoleMasterRequestHeader {
  header = new Header(UUID.UUID());
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
  roleId: number;
 
  companyId: number;
 
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
 // venueDetails: any;
  header: Header;

}

@Component({
  selector: 'app-add-role-user',
  templateUrl: './add-role-user.component.html',
  styleUrls: ['./add-role-user.component.scss']
})
export class AddRoleUserComponent implements OnInit {

  selectedData: AddUser;
  selectedType: Array<string>;
  roleList: DropDownModel[] = [];
  selectedRole: DropDownModel;
  companyList: DropDownModel[] = [];
  systemList: DropDownModel[] = [];
  selectedCompany: DropDownModel;
  selectedSystem: DropDownModel;
  venueList: DropDownModel[] = [];
  roleHeader = new RoleHeader();
  @Input()
  name: string;
  dateOfBirth: string;
  marriageDate: string;
  header = new Header(UUID.UUID());
  gender: any;
  venueOptions = [];
  selectedVenueOptions = [];

  selectedVenue = this.selectedVenueOptions;
  showError = false;
  errorMessage = "";
  systemId: string;


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
      roleId: 0,
      companyId: 0,
      systemId: '',
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
    this.getAllCompanyDetails();
    this.getAllSystemDetails();
    this.selectedType = ['Male', 'Female'];
  }
   public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.selectedCompany != null) {
      this.selectedData.companyId = this.selectedCompany.id;
    }

    if (this.selectedSystem != null) {
      this.selectedData.systemId = this.selectedSystem.name;
    }
    console.log("venue:",this.selectedVenue.toString());
    if(this.selectedVenue != null){
     // this.selectedData.venueDetails=this.selectedVenue.toString();
    }
    if(this.dateOfBirth != null)
    {
      this.selectedData.dateOfBirth=this.dateOfBirth;
    }
    if(this.marriageDate !=null)
    {
      this.selectedData.marriageDate=this.marriageDate;
    }
    
    let validationMessage = this.validation();
    if (validationMessage == false) {
      this.addUserInfo();
    } else {
      this.openSnackBar("Please fill the red marked fields", validationMessage);
    }
  }

    // Validation part 
    validation() {
      if (this.selectedData.userId == '' || this.selectedData.userId + '' == 'undefined') {
        return 'User Id is required!';
      } else if (this.selectedData.companyId == 0 || this.selectedData.companyId + '' == 'undefined') {
        return 'Company Name is required!';
      } else if (this.selectedData.primaryEmail == '' || this.selectedData.primaryEmail + '' == 'undefined') {
        return 'Primary Email is required!';
      } else if (this.selectedData.primaryPhoneNumber == '' || this.selectedData.primaryPhoneNumber + '' == 'undefined') {
        return 'Primary Phone number is required!';
      } else {
        return false;
      }
    }

  public addUserInfo() {
 
    this.selectedData.header = this.header;
    this.selectedData.roleId = this.selectedRole.id;
    this.selectedData.systemId = this.systemId;

  
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
          this.router.navigate(["/role-user"]);
        } else if ((result.statusCode == "1002")) {
          this.openSnackBar(result.statusDescription, "error");
        }
      });
  }

  private getAllRoles(companyId:number,systemId:string) {

    this.roleList = [];
    this.restService
      .get(environment.getRoleByCompanyandSystemId+companyId+"/systemId/"+systemId)
      .map((res: any) => {
        if (res) {
          res.forEach(erg => {
            this.roleList.push(new DropDownModel(erg.role_id, erg.role_name));
          });
        }
      })
      .subscribe(
        roleList => { },
        err => { }
      );
  }

  private getAllCompanyDetails() {
    this.companyList = [];

    let request = new AddRoleMasterRequestHeader();
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
      .subscribe(
        companyList => { },
        err => { }
      );
  }

  private getAllSystemDetails() {
    this.systemList = [];
    this.restService
      .get(environment.viewSystemPath)
      .map((res: any) => {
        if (res) {
          res.forEach(erg => {
            this.systemList.push(
              new DropDownModel(erg.systemId, erg.systemName)
            );
          });
        }
      })
      .subscribe(
        systemList => { },
        err => { }
      );
  }

  getAllRoleVenueBasedOnCompanyandSystem() {

    if (this.selectedCompany == null || this.selectedCompany.id == 0) {
      return 'Company Name is required!';
     }
    this.systemId = "moviepanda-admin";
    this.getAllRoles(this.selectedCompany.id,this.systemId);
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
