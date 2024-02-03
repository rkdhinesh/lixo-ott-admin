import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BoxOffice } from '../box-office';
import { HttpClient } from '@angular/common/http';
import { BoxOfficeId } from './boxofficeid';
import { BoxOfficeHeader } from '../../../shared/services/box-office-header';
import { UserResponse } from '../../publish/userresponse';
import { CompanyVenueRequest } from '../../company/view-company/view-company.component';
import { environment } from '../../../../environments/environment';
import { UUID } from '../../../shared/services/uuid';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';
import { RestService } from '../../../api.service';
import { AddUserHeader } from '../../../shared/services/add-user-header';


export class AddUserRoleRequestHeader {
  header = new AddUserHeader(UUID.UUID());
  constructor() { }
}

export class User {
  user_credential_id: number;
  venue_id: number;

}

export class DropDownModel {
  id: number;
  name: string;
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}


@Component({
  selector: 'app-add-user-role',
  templateUrl: './add-user-role.component.html',
  styleUrls: ['./add-user-role.component.scss']
})
export class AddUserRoleComponent implements OnInit {

  selectedData: BoxOffice;
  selectedUser: User;
  dateOfBirth: string;
  marriageDate: string;
  boxoffice = new BoxOfficeHeader();
  header = new Header(UUID.UUID());
  adduserheader = new AddUserHeader(UUID.UUID());
  gender: any;
  showError = false;
  errorMessage = '';
  roleList: DropDownModel[] = [];
  selectedRole: DropDownModel;
  companyList: DropDownModel[] = [];
  selectedCompany: DropDownModel;
  venueList: DropDownModel[] = [];
  selectedVenue: DropDownModel;
  credentialId: any;
  seletedVenueId: any;
  userCredentialId: number;
  boxOfficeId = new BoxOfficeId();



  getSelectedVenueOptions(venue: DropDownModel) {

    localStorage.setItem('venueId', JSON.stringify(venue.id));
  }

  constructor(
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private log: LogService,
    private http: HttpClient,
  ) { }

  loadAddUser() {
    let user = <BoxOffice>({
      userId: '',
      roleId: '',
      companyId: '',
      systemId: this.boxOfficeId.systemId,
      primaryEmail: '',
      primaryPhoneNumber: '',

    });

    this.selectedData = user;
  }

  userCredential() {
    let userId = <User>({
      user_credential_id: 0,
      venue_id: 0,
    });

    this.selectedUser = userId;
  }

  ngOnInit() {
    this.loadAddUser();
    this.userCredential();
    this.getAllRoles();
    this.getAllCompanyDetails();
  }



  public saveUserDetail() {
    let validationMessage = this.validation();
    if (validationMessage == false) {
      this.userProfile();
    } else {
      this.openSnackBar("Please fill the red marked fields", validationMessage);
    }
  }

  //useruserCredentialId
  userBoxOfficeMap() {
    this.selectedUser.user_credential_id = this.userCredentialId;
    this.seletedVenueId = JSON.parse(localStorage.getItem('venueId'));
    this.selectedUser.venue_id = this.seletedVenueId;
    this.restService.post(
      this.selectedUser, environment.userCredential
    ).map((response: any) => {
      return response;
    })
      .subscribe(response => {
      })
  }

  //add user profile
  userProfile() {
    this.selectedData.header = this.adduserheader;
    this.selectedData.roleId = this.selectedRole.id + "";
    this.selectedData.companyId = this.selectedCompany.id + "";

    const baseUrl = `${environment.baseUrl}` + environment.addUserPath;
    this.http
      .post(baseUrl, this.selectedData, this.boxoffice)
      .map((response: any) => {
        this.userCredentialId = response.userResponseBO.user.userCredentialId;
        return new UserResponse(
          response.status.statusCode,
          response.status.statusDescription,
          response.status.transactionId
        );
      })
      .subscribe(result => {
        this.log.info(
          'inside response' +
          result.statusCode +
          '' +
          result.statusDescription +
          '' +
          result.transactionId
        );
        if ((result.statusCode == '2001')) {
          this.openSnackBar('Successfully Saved', this.selectedData.userId);
          this.userBoxOfficeMap();
          this.router.navigate(['/box-office-users']);
        } else if ((result.statusCode == '1002')) {
          this.openSnackBar('Operation Failed', this.selectedData.userId);
        }
        else if (result.statusCode == '3002') {
          this.openSnackBar('User Already Exists', this.selectedData.userId);
        }
      });
  }

  validation() {
    if (this.selectedData.userId == '') {
      return 'User Name is required!';
    } else if (this.selectedData.roleId == '') {
      return 'Role Id is required!';
    } else if (this.selectedData.companyId == '') {
      return 'Company is required!';
    } else if (this.selectedData.primaryEmail == '') {
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


  private getAllRoles() {

    this.roleList = [];
    this.restService
      .get(environment.getAllRoleMaster)
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
      .subscribe(
        companyList => { },
        err => { }
      );
  }

  getAllVenueBasedOnCompany() {
   
    this.venueList = [];
    let venueRequest = <CompanyVenueRequest>{};
    venueRequest.companyId = this.selectedCompany.id;   
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

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }





}
