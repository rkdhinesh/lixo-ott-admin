import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddUserId } from '../add-user/adduserid';
import { Header } from '../../../shared/services/header';
import { UserRole } from '../../../shared/model/user-role';
import { UUID } from '../../../shared/services/uuid';
import { RoleHeader } from '../../../shared/services/role-header';
import { TempDataService } from '../../../shared/temp-dataStore';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';
import { Status } from '../../../shared/model/response-status-model';

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
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  userRole = new UserRole();
  isLoading: boolean = true;
  data: any;
  marriageDate = new Date();
  dateOfBirth = new Date();
  selectedData: EditUser;
  selectedUserRoleData: UserRole;
  roleList: DropDownModel[] = [];
  selectedRole: DropDownModel;
  companyList: DropDownModel[] = [];
  selectedCompany: DropDownModel;
  venueList: DropDownModel[] = [];
  buttonStatus: boolean;
  userIds = new AddUserId();
  @Input()
  name: string;
  // dateOfBirth: string;
  // marriageDate: string;
  header = new Header(UUID.UUID());
  roleHeader = new RoleHeader();

  venueOptions = [];
  selectedVenueOptions = [];

  selectedVenue = this.selectedVenueOptions;
  showError = false;
  errorMessage = '';

  getSelectedVenueOptions(selected) {
    this.selectedVenue = selected;
  }

  onResetSelection() {
    this.selectedVenueOptions = [];
  }

  constructor(private tempDataService: TempDataService, private route: ActivatedRoute,
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
      roleId: '',
      companyId: '',
      systemId: this.userIds.systemId,
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
    this.dateOfBirth = new Date(this.selectedData.dateOfBirth);
    this.marriageDate = new Date(this.selectedData.marriageDate);
    this.log.info("EDIT METHOD=====" + JSON.stringify(this.selectedUserRoleData));
    JSON.stringify(this.selectedUserRoleData);
    let header = new Header(UUID.UUID());
    let editUserRoleRequest = <EditUserRoleRequestHeader>({});
    editUserRoleRequest.header = header;
    const baseUrl = `${environment.baseUrl}` + environment.retrieveUserProfilePath;

    this.http.post(baseUrl, editUserRoleRequest, this.roleHeader)
      .map((response: any) => {
        debugger;
        let result: EditUser;
        if (response) {
          result = response;
          this.selectedData.userId = result.user_id;
          this.selectedData.roleId = result.roleId;
          this.selectedData.companyId = result.companyId;
          this.selectedData.systemId = result.systemId;
          this.selectedData.firstName = result.first_name;
          this.selectedData.lastName = result.last_name;
          this.selectedData.middleName = result.middle_name;
          this.selectedData.profileImageUrl = result.profile_image_url;
          this.selectedData.primaryEmail = result.primaryEmail;
          this.selectedData.primaryPhoneNumber = result.primaryPhoneNumber;
          this.selectedData.secondaryPhoneNumber = result.secondary_phone_number;
          this.selectedData.alternativeEmailId = result.alternative_email_id;
          this.selectedData.gender = result.gender;
          this.selectedData.dateOfBirth = result.date_of_birth;
          this.selectedData.maritalStatus = result.marital_status;
          this.selectedData.marriageDate = result.marriage_date;
          this.selectedData.userSecret = result.userSecret;


        }
        this.log.info(JSON.stringify(this.selectedData));
        return result;
      })
      .subscribe(result => { },
        err => { }
      );

  }

  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.editValueValidation() == true) {

      this.selectedData.dateOfBirth = this.datePipe.transform(this.dateOfBirth, 'dd-MMM-yyyy');
      this.selectedData.marriageDate = this.datePipe.transform(this.marriageDate, 'dd-MMM-yyyy');
      this.save();
      this.router.navigate(['/box-office-users'])
    } else {
      this.openSnackBar("Please fill the red marked fields", "all field");
    }
  }

  public save() {

    let header = new Header(UUID.UUID());
    this.selectedData.header = header;
    this.http.post(environment.updateUserProfilePath, this.selectedData, this.roleHeader)
      .map((res: any) => {
        return new Status(res.status["statusCode"], res.status["statusDescription"], res.status['transactionId']);
      })
      .subscribe(result => {
        this.log.info(JSON.stringify(result));
        if (result.statusCode == '2000') {
          this.openSnackBar(this.selectedData.userId, "Saved Successfully");
          this.router.navigate(['/user-role']);
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

  // Validation part 

  validation() {
    if (this.selectedData.firstName == '') {
      return 'First Name is required!';
    }
    else if (this.selectedData.lastName == '') {
      return 'Last Name is required!';
    }
    else if (this.selectedData.userId == null) {
      return 'User Id is required!';
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

  addUserInfo() {

  }
  editStatus() {
    if (this.buttonStatus) {
      this.buttonStatus = false;
    }


  }

  getAllVenueBaesdOnCompany() {

  }

  // editStatus() {
  //   if (this.buttonStatus) {
  //     this.buttonStatus = false;
  //     this.myControl.enable();
  //     this.companyControl.enable();
  //     this.venueControl.enable();
  //   }
  // }
  // public show: boolean = false;
  // toggle() {
  //   this.show = !this.show;
  // }

}
