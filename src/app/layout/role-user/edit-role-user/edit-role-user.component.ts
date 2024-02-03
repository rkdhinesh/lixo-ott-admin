import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../../../api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from '../../../shared/services/log.service';
import { UUID } from '../../../shared/services/uuid';
import { DatePipe } from '@angular/common';
import { CompanyVenueRequest } from '../../../layout/company/view-company/view-company.component';
import { FormControl } from '@angular/forms';
import { Status } from '../../../shared/model/response-status-model';
import { UserRole } from '../../../shared/model/user-role';
import { TempDataService } from '../../../shared/temp-dataStore';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RoleHeader } from '../../../shared/services/role-header';
import { Header } from '../../../shared/services/header';
import { RoleUser } from '../../../shared/model/RoleUser';
import { RoleUsers } from '../../../shared/model/role-user';

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

export class EditUser {


  userId: string;
  roleId: number;
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
}

@Component({
  selector: 'app-edit-role-user',
  templateUrl: './edit-role-user.component.html',
  styleUrls: ['./edit-role-user.component.scss']
})
export class EditRoleUserComponent implements OnInit {

  userRole = new UserRole();
  isLoading: boolean = true;
  data: any;

  selectedData: EditUser;

  selectedUserRoleData: RoleUser;
  roleList: DropDownModel[] = [];
  selectedRole: any;
  companyList: DropDownModel[] = [];
  selectedCompany: DropDownModel;
 
  selectedSystem: any;
  venueList: DropDownModel[] = [];
  buttonStatus: boolean;
  @Input()
  name: string;
  dateOfBirth: string;
  marriageDate: string;
  header = new Header(UUID.UUID());
  roleHeader = new RoleHeader();

  company: string;
  venueOptions = [];
  selectedVenueOptions = [];

  selectedVenue = this.selectedVenueOptions;
  showError = false;
  errorMessage = '';
  getUserId: string;

  getSelectedVenueOptions(selected) {
    this.selectedVenue = selected;
  }

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
      roleId: 0,
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



  ngOnInit() {
    this.log.info("EDIT METHOD");
    this.tempDataService.currentSelectedData.subscribe(selectedUserRoleData => this.selectedUserRoleData = selectedUserRoleData);

    this.dateOfBirth = this.selectedData.dateOfBirth;
    this.marriageDate = this.selectedData.marriageDate;
    this.log.info("EDIT METHOD=====" + JSON.stringify(this.selectedUserRoleData));
    this.getAllCompanyDetails();
    this.selectedRole =this.selectedUserRoleData.roleId;
    this.selectedData.companyId = this.selectedUserRoleData.companyId;
    this.clear();
 
    this.restService
    .get(environment.getUserDetails + this.selectedUserRoleData.userId)
    .subscribe({
      next: (response) => {
        this.log.info("Get user Details:::" + response.userDetails.userCredentialId);
        localStorage.setItem("userCredentialId", response.userDetails.userCredentialId);
        this.selectedData.userId = response.userDetails.userId;
        this.selectedData.companyId = response.userDetails.companyId;
        this.selectedSystem = response.userDetails.systemId;
        this.selectedData.primaryEmail = response.userDetails.primaryEmail;
        this.selectedData.primaryPhoneNumber = response.userDetails.primaryPhoneNumber;
       this.getAllRoles(this.selectedData.companyId);
      this.selectedData.firstName = this.companyList.find(data => data.id==this.selectedData.companyId).name;
       this.getAllRoleVenueBasedOnCompanyandSystem();
      },
      
    });
   
 
     
  }

  public saveDetail() {
    this.log.info("SAVE METHOD");

    
    if (this.selectedRole != null) {
      this.selectedData.roleId = this.selectedRole.id;
    }
     
    let validationMessage = this.validation();
    if (validationMessage == false) {
      this.save();
     
    } else {
      this.openSnackBar("Please fill the red marked fields", validationMessage);
    }
  }

    // Validation part 
    validation() {
      if (this.selectedData.userId == '' || this.selectedData.userId + '' == 'undefined') {
        return 'User Id is required!';
      }  else if (this.selectedData.primaryEmail == '' || this.selectedData.primaryEmail + '' == 'undefined') {
        return 'Primary Email is required!';
      } else if (this.selectedData.primaryPhoneNumber == '' || this.selectedData.primaryPhoneNumber + '' == 'undefined') {
        return 'Primary Phone number is required!';
      } else {
        return false;
      }
    }

  public save() {

    let header = new Header(UUID.UUID());
    this.selectedData.header = header;
    this.selectedData.systemId =  "moviepanda-admin"
    this.selectedData.loginType = "moviepanda-admin";
   
    const baseUrl = `${environment.baseUrl}` + environment.updateUserProfilePath;
    this.http.post(baseUrl, this.selectedData)
      .map((res: any) => {
        return new Status(res.status["statusCode"], res.status["statusDescription"], res.status['transactionId']);
      })
      .subscribe(result => {
        this.log.info(JSON.stringify(result));
        if (result.statusCode == '2001') {
          this.openSnackBar(this.selectedData.userId, "Saved Successfully");
          if(this.selectedUserRoleData.roleId !== this.selectedRole){
            this.updateRole();
          }
          
          this.router.navigate(['/role-user']);
        } else if (result.statusCode == '1002') {
          this.openSnackBar(result.statusDescription, this.selectedData.userId);
        } else {
          this.openSnackBar(result.statusDescription, this.selectedData.userId);
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }


  public updateRole(){

    let userRole = new RoleUsers();
    userRole.role_id = this.selectedRole;
    userRole.system_id = "moviepanda-admin";
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

 
  private getAllRoles(company:any) {

    this.roleList = [];
    this.selectedSystem = "moviepanda-admin";
   
    this.restService
      .get(environment.getRoleByCompanyandSystemId+company+"/systemId/"+this.selectedSystem)
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



  getAllRoleVenueBasedOnCompanyandSystem() {

 
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

 

  

}
