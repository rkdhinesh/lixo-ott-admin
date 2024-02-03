import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Header } from '../../shared/services/header';
import { RestService } from '../../api.service';
import { LogService } from '../../shared/services/log.service';
import { UUID } from '../../shared/services/uuid';
import { environment } from '../../../environments/environment';
import { PublishResponse } from '../publish/publishResponse';

export class ResetPasswordRoleRequestHeader {
  constructor() { }
}

export class RestPassword {
  userId: string;
  userCredentialId: number;
  companyId: string;
  systemId: string;
  password: string;
  header: Header;
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  selectedData: RestPassword;
  header: Header;
  currentUser: any;
  confirmPassword: string;
  message: string;

  constructor(
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private log: LogService,
  ) { }

  ngOnInit() {
    let user = <RestPassword>{
      userId: '',
      userCredentialId: 0,
      systemId: 'moviepanda-admin',
      password: ''
    };
    this.selectedData = user;
    this.header = new Header(UUID.UUID());
  }
clearStorage(){
  localStorage.removeItem('currentUser');
  localStorage.removeItem('userId');
  window.sessionStorage.removeItem('AuthToken');
  window.sessionStorage.removeItem('RefreshAuthToken');
  localStorage.setItem('isLoggedin', 'false');
  this.router.navigate(['/']);
}
  public saveNewPassword() {
    if (this.selectedData.password == this.confirmPassword) {
      this.selectedData.header = this.header;
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
      this.selectedData.userId = this.currentUser.userName;
      this.selectedData.userCredentialId = 0;
      this.restService
        .post(this.selectedData, environment.updatePassword)
        .map((publish: any) => {
          let result: PublishResponse;
          result = new PublishResponse(
            publish.status['statusCode'],
            publish.status['statusDescription'],
            publish.status['transactionId']
          );
          return result;
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
            this.openSnackBar(result.statusDescription, 'success');
            localStorage.removeItem('currentUser');
            localStorage.removeItem('userId');
            window.sessionStorage.removeItem('AuthToken');
            window.sessionStorage.removeItem('RefreshAuthToken');
            localStorage.setItem('isLoggedin', 'false');
            this.router.navigate(['/']);
            
          } else if ((result.statusCode == '3001')) {
            this.openSnackBar(result.statusDescription, 'Failed');
          } else {
            this.openSnackBar(result.statusDescription, 'Error');
          }
        });
    } else {
      this.openSnackBar('Password not matching', 'success');
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
}
