import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AutoComplete } from '../../../shared/model/auto-complete';
import { RestService } from '../../../api.service';
import { Status } from '../../../shared/model/response-status-model';
import { UserRole } from '../../../shared/model/user-role';
import { BoxOfficeHeader } from '../../../shared/services/box-office-header';
import { Header } from '../../../shared/services/header';
import { LogService } from '../../../shared/services/log.service';
import { UUID } from '../../../shared/services/uuid';
import { environment } from '../../../../environments/environment';
import { BoxOfficeId } from '../add-user-role/boxofficeid';
import { RoleUser } from '../../../shared/model/RoleUser';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RoleUsers } from '../../../shared/model/role-user';
import { CompanyVenueRequest } from '../../company/view-company/view-company.component';

export class EditUserRoleRequestHeader {
  header: Header;
  companyId: string;
  systemId: string;
  userId: string;
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

export class User {
  user_credential_id: number;
  venue_id: number;
  user_venue_id: number;

}


export class EditUser {


  userId: string;
  companyId: number;
  companyName: string;
  systemId: string;
  firstName: string;
  lastName: string;
  middleName: string;
  loginType: string;
 // venueDetails: string;
  profileImageUrl: string;
  primaryEmail: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber: string;
  alternativeEmailId: string;
  gender: string;
  dateOfBirth: string;
  maritalStatus: string;
  marriageDate: string;
  userSecret: string;
  editable: boolean;
  header: Header;
  user_id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  profile_image_url: string;
  alternative_email_id: string;
  secondary_phone_number: string;
  date_of_birth: string;
  marital_status: string;
  marriage_date: string;
  venueDetails: string;
}


@Component({
  selector: 'app-edit-user-role',
  templateUrl: './edit-user-role.component.html',
  styleUrls: ['./edit-user-role.component.scss']
})
export class EditUserRoleComponent implements OnInit {
  userRole = new UserRole();
  isLoading: boolean = true;
  data: any;
  marriageDate = new Date();
  dateOfBirth = new Date();
  selectedData: EditUser;
  selectedUserRoleData: RoleUser;
  roleList: DropDownModel[] = [];
  selectedRole: any;
  companyList: DropDownModel[] = [];
  selectedCompany: DropDownModel;
  venueList: DropDownModel[] = [];
  buttonStatus: boolean;
  getUserId: any;
  getCredential: any;
  boxoffice = new BoxOfficeHeader();
  header = new Header(UUID.UUID());
  venueOptions = [];
  selectedVenueOptions = [];
 // selectedVenue = this.selectedVenueOptions;
 selectedVenue: any;
  showError = false;
  errorMessage = '';
  getUserVenue: any;
  getVenueId: any;
  boxOfficeId = new BoxOfficeId();
  selectedUser: User;
  

  // onToggleDropdown() {
  //   this.multiSelect.toggleDropdown();
  // }

   getSelectedVenueOptions(selected) {
    this.selectedVenue = selected;
    localStorage.setItem('venueId', JSON.stringify(this.selectedVenue));
  } 

  /* getSelectedVenueOptions(venue: DropDownModel) {
    localStorage.setItem('venueId', JSON.stringify(venue.id));
  } */

  onResetSelection() {
    this.selectedVenueOptions = [];
  }


  constructor(private tempDataService: TempDataService, private restService: RestService, private route: ActivatedRoute,
    private router: Router, public snackBar: MatSnackBar,
    private datePipe: DatePipe, private log: LogService,
    private http: HttpClient) {
    this.clear();
  }

  myControl: FormControl = new FormControl();
  companyControl: FormControl = new FormControl();
  venueControl = new FormControl();
  clear() {
    let user = <EditUser>({
      userId: '',
   //   roleId: 0,
      loginType: '',
      companyId: 0,
      systemId: '',
      firstName: '',
      lastName: '',
      middleName: '',
      profileImageUrl: '',
      primaryEmail: '',
      primaryPhoneNumber: '',
      alternativeEmailId: '',
      gender: '',
      dateOfBirth: '',
      maritalStatus: '',
      marriageDate: '',
    });
    this.selectedData = user;
  }
  userCredential() {
    let userId = <User>({
      user_credential_id: 0,
      venue_id: 0,
      user_venue_id: 0,
    });
  
    this.selectedUser = userId;
  }

 ngOnInit() {
    this.log.info("EDIT METHOD");

    
   
    this.tempDataService.currentSelectedData.subscribe(selectedUserRoleData => this.selectedUserRoleData = selectedUserRoleData);
    this.log.info("EDIT METHOD=====" + JSON.stringify(this.selectedUserRoleData));
    this.selectedRole  =this.selectedUserRoleData.roleId;
    this.selectedData.companyId = this.selectedUserRoleData.companyId;
    this.userCredential();
    this.getAllCompanyDetails();
   this.getUserProfile();

  }

  

  public saveDetail() {
    this.log.info("SAVE METHOD");
    if (this.editValueValidation() == true) {
      this.save();
      this.router.navigate(['/box-office-users'])
    } else {
      this.openSnackBar("Please fill the red marked fields", "all field");
    }
  }

  public save() {
    let header = new Header(UUID.UUID());
    this.selectedData.header = header;
    this.selectedData.systemId =  "box-office"
    this.selectedData.loginType = "moviepanda-box-office";
    this.restService.post(this.selectedData, environment.updateUserProfilePath)
      .map((res: any) => {
        return new Status(res.status["statusCode"], res.status["statusDescription"], res.status['transactionId']);
      })
      .subscribe(result => {
        this.log.info(JSON.stringify(result));
        if (result.statusCode == '2001') {
          this.openSnackBar('Successfully Saved', "Saved Successfully");
          if(this.selectedUserRoleData.roleId !== this.selectedRole){
            this.updateRole();
          }
          
          this.userBoxOfficeMap();
         
          this.router.navigate(['/box-office-users']);
        } else if (result.statusCode == '1002') {
          this.openSnackBar('Operation Failed', this.selectedData.userId);
        } else {
          this.openSnackBar(result.statusDescription, this.selectedData.userId);
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  validation() {
   if (this.selectedData.primaryEmail == '') {
      return 'Primary Email is required!';
    } else if (this.selectedData.venueDetails == '') {
      return 'Venue is required!';
    } else if (this.selectedData.primaryPhoneNumber == '') {
      return 'Primary Phone Number is required!';
    }
    else {
      return false;
    }
  }

  editValueValidation() {
    if (this.validation() == false) {
      return true;
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

  editStatus() {
    if (this.buttonStatus) {
      this.buttonStatus = false;
    }
  }

  //edit user profile 
  async getUserProfile() {
    this.getUserId = localStorage.getItem("userId");
    let systemId = "box-office";
    var headers = new HttpHeaders({
      'Content-Type': 'application/json',
      "systemId": systemId,

      })
      var httpOptions = {
        headers : headers,
        url : environment.getUserDetails + this.selectedUserRoleData.userId
      }
    this.restService
    .getWithHeaders(httpOptions)
    .subscribe({
        next: (response) => {
          this.selectedData.userId = response.userDetails.userId;
          this.selectedData.systemId = response.userDetails.systemId;
          this.selectedData.primaryEmail = response.userDetails.primaryEmail;
          this.selectedData.primaryPhoneNumber = response.userDetails.primaryPhoneNumber;
          this.log.info("Get user Details:::" + response.userDetails.userCredentialId);
          localStorage.setItem("userCredentialId", response.userDetails.userCredentialId);
          this.log.info("GetcompanyId:::" + this.selectedData.companyId);
          this.getAllRoles(this.selectedData.companyId);
          this.getUserCredential();
          this.getAllVenueBasedOnCompany(); 
          this.selectedData.firstName = this.companyList.find(data => data.id==this.selectedData.companyId).name;
          console.log("this.firstName", this.selectedData.firstName);
          
        },
      });
  }

  getUserCredential() {
    this.getCredential = localStorage.getItem("userCredentialId");
    this.restService
      .get(environment.getCredentialId + this.getCredential)
      .subscribe({
        next: (response) => {
          localStorage.setItem("venueId", response.venueId);
          localStorage.setItem("uservenueId", response.userVenueId);
          this.selectedVenue = response.venueId;
           this.selectedVenueOptions.push(this.selectedVenue)
        },
      });
  }


  public updateRole(){

    let userRole = new RoleUsers();
    userRole.role_id = this.selectedRole.id;
    userRole.system_id = "box-office";
    userRole.user_id = this.selectedData.userId;
    userRole.user_role_id = this.selectedUserRoleData.userRoleId;
    userRole.company_id = this.selectedUserRoleData.companyId;
    const baseUrl = `${environment.baseUrl}` + environment.addRoleUser;
    this.http.put(baseUrl,userRole)
    .map((res: any) => {
      return res;
    })
    .subscribe(response => {
    })
  }


   getAllRoles(company:any) {

    this.roleList = [];
    this.selectedData.systemId = "box-office";
   
    this.restService
      .get(environment.getRoleByCompanyandSystemId+company+"/systemId/"+ this.selectedData.systemId)
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
  getAllRoleVenueBasedOnCompanyandSystem() {

 
    this.venueOptions = [];
    this.selectedVenue = [];
    this.onResetSelection();
    let venueRequest = <CompanyVenueRequest>{};
    venueRequest.companyId = this.selectedData.companyId;
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

  getAllVenueBasedOnCompany() {
  
    this.venueList = [];
    let venueRequest = <CompanyVenueRequest>{};
    venueRequest.companyId = this.selectedData.companyId;   
    venueRequest.header = this.header;
    this.restService
      .post(venueRequest, environment.getAllVenueByCompanyPath)
      .map((res: any) => {
        if (res) {
          res.venues.forEach(erg => {
            this.venueList.push(
              new DropDownModel(erg.venueId, erg.venueName)
            );
          });
        }
      })
      .subscribe(
        venueList => { },
        err => { }
      );
  }


  private getAllCompanyDetails() {
    this.companyList = [];

     let header = new Header(UUID.UUID());
   let editUserRoleRequest = <EditUserRoleRequestHeader>({});
   editUserRoleRequest.header = header;
    this.restService
      .post(editUserRoleRequest, environment.viewCompanyPath)
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
//useruserCredentialId
public userBoxOfficeMap() {
  
  this.selectedVenue = parseInt(JSON.parse(localStorage.getItem('venueId')));
   var userVenueId = parseFloat(localStorage.getItem("uservenueId"));
   this.selectedUser.user_venue_id = userVenueId;
  var userCredentialId = parseFloat(localStorage.getItem("userCredentialId")); 
  this.selectedUser.user_credential_id = userCredentialId;
  this.selectedUser.venue_id = this.selectedVenue;
  this.restService.put(
    this.selectedUser, environment.getVenueId
  ).map((response: any) => {
    return response;
  })
    .subscribe(response => {
    })
}



}
