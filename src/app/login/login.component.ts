import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UUID } from '../shared/services/uuid';
import { Login } from '../shared/model/login';
import { TokenStorage } from '../shared/guard/token-storage';
import { LoginValidatonOtpModel } from '../shared/model/validationloginotp';
import { Header } from '../shared/services/header';
import { environment } from '../../environments/environment';
import { FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginOtpModel } from '../shared/model/loginotp';
export class LoginRequestHeader {
  userId: string;
  password: string;
  systemId: string;
  companyId: string;
  header: Header;
  constructor() { }
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  selectedData: Login;
  selectData: LoginOtpModel;
  selectedOtpData: LoginValidatonOtpModel;
  NewPassword: boolean = false;
  hidebutton: boolean = false;
  passwordOtp: boolean = false;
  timer: boolean;
  settimer: boolean;
  timeLeft: string = '60';
  interval;
  error: string;
  rememberEnabled: boolean;
  isRememberMe: any;
  companyid: any;
  systemid: any;
  phoneNumber: any;
  constructor(
    private restService: RestService,
    private token: TokenStorage,
    public dialog: MatDialog,
    public router: Router,
    public snackBar: MatSnackBar,
    private Http: HttpClient,
  ) { }
  myControl: FormControl = new FormControl();
  ngOnInit() {
    this.selectedData = new Login();
    this.selectedData.userId = '';
    this.selectedData.password = '';
    this.selectData = new LoginOtpModel();
    this.selectData.phoneNumber = '';
    this.selectedOtpData = new LoginValidatonOtpModel();
    this.selectedOtpData.otp = '';
    this.rememberMe();
  }
  //only number will be add
  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  onLoggedin() {
    // this.error = this.errorvalidation();
    const header = new Header(UUID.UUID());
    const loginRequest = <LoginRequestHeader>{};
    if (this.rememberEnabled === true) {
      localStorage.setItem('Uname', this.selectedData.userId);
      localStorage.setItem('Password', this.selectedData.password);
      localStorage.setItem('isRememberMe', 'Yes');
    } else {
      localStorage.setItem('isRememberMe', 'No');
    }
    loginRequest.header = header;
    loginRequest.userId = this.selectedData.userId;
    localStorage.setItem('userId', JSON.stringify(this.selectedData.userId));
    loginRequest.password = this.selectedData.password;
    loginRequest.systemId = 'moviepanda-admin';
    localStorage.setItem('isLoggedin', 'false');
    this.restService
      .post(loginRequest, environment.authenticate)
      .map((response: any) => {
        const outputJsonResponse = response;
        // tslint:disable-next-line: triple-equals
        if (outputJsonResponse.status['statusCode'] === '1001') {
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              userName: this.selectedData.userId,
              companyId: outputJsonResponse.companyId,
              token: outputJsonResponse.token,
              refreshToken: outputJsonResponse.refreshToken
            })
          );
          this.token.saveToken(
            outputJsonResponse.token,
            outputJsonResponse.refreshToken
          );
          this.router.navigate(['/movie']);
        } else {
          this.openSnackBar('Error:Authenticate Failed ', this.error);
        }
      })
      .subscribe(
        result => { },
        err => { }
      );
    this.timer = true;
  }
  LoginOtp() {
    const header = new Header(UUID.UUID());
    const loginotpRequest = <LoginOtpModel>{};
    loginotpRequest.header = header;
    loginotpRequest.phoneNumber = this.phoneNumber;
    localStorage.setItem('isLoggedin', 'false');
    this.restService
      .post(loginotpRequest, environment.loginotp)
      .map((response: any) => {
        const outputJsonResponse = response;
        // tslint:disable-next-line: triple-equals
        if (outputJsonResponse.status['statusCode'] === '2001') {
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              userName: this.selectedData.userId,
              token: outputJsonResponse.token,
              refreshToken: outputJsonResponse.refreshToken
            })
          );
          this.token.saveToken(
            outputJsonResponse.token,
            outputJsonResponse.refreshToken
          );
          if (loginotpRequest.phoneNumber.length === 10) {
            this.selectData.phoneNumber = loginotpRequest.phoneNumber.slice(0, 3) + loginotpRequest.phoneNumber.slice(3, 6) + loginotpRequest.phoneNumber.slice(6, 10);
            this.passwordOtp = true;
          } else {
            this.openSnackBar('Error:Enter Valid Mobile Number ', this.error);
          }
          this.timer = false;
          this.settimer = true;
        } else {
          this.openSnackBar('Error:Enter Correct Mobile Number ', this.error);
        }
      })
      .subscribe(
        result => { },
        err => { }
      );
  }
  ValidateOtp() {
    const header = new Header(UUID.UUID());
    const validationotpRequest = <LoginValidatonOtpModel>{};
    validationotpRequest.header = header;
    validationotpRequest.otp = this.selectedOtpData.otp;
    validationotpRequest.phoneNumber = this.selectData.phoneNumber;
    validationotpRequest.systemId = this.systemid;
    validationotpRequest.companyId = this.companyid;
    localStorage.setItem('isLoggedin', 'false');
    this.restService
      .post(validationotpRequest, environment.validationotp)
      .map((response: any) => {
        const outputJsonResponse = response;
        // tslint:disable-next-line: triple-equals
        if (outputJsonResponse.status['statusCode'] === '2001') {
          localStorage.setItem('isLoggedin', 'true');
          localStorage.setItem(
            'currentUser',
            JSON.stringify({
              userName: this.selectedData.userId,
              token: outputJsonResponse.token,
              refreshToken: outputJsonResponse.refreshToken
            })
          );
          this.token.saveToken(
            outputJsonResponse.token,
            outputJsonResponse.refreshToken
          );
          this.router.navigate(['/reset-password']);
        } else {
          this.openSnackBar('Error:Valid Otp ', this.error);
        }
      })
      .subscribe(
        result => { },
        err => { }
      );
  }
  loginpassword() {
    if (this.selectedData.userId == '') {
      this.openSnackBar('Error:userId is required! ', this.error);
      return;
    }
    const httpOptions = {
      headers: new HttpHeaders({
        "systemId": "moviepanda-admin",
      }),
    };
    // const header = new Header(UUID.UUID())
    const url = `${environment.baseUrl}${environment.userDetails}`;
    this.Http
      .get(url + this.selectedData.userId, httpOptions)
      .subscribe({
        next: (response: any) => {
          this.companyid = response.userDetails.companyId;
          this.systemid = response.userDetails.systemId;
          this.phoneNumber = response.userDetails.primaryPhoneNumber;
          if (response != null) {
            this.NewPassword = true;
            this.hidebutton = true;
            this.LoginOtp();
            this.startTimer();
          } else {
            this.openSnackBar('Error:UserId not Exit ', this.error);
          }
        },
      });
  }
  /// timer settime in login otp screen
  startTimer() {
    this.interval = setInterval(() => {
      var timeLeft = parseInt(this.timeLeft);
      if (timeLeft > 0) {
        timeLeft--;
        this.timeLeft = String(timeLeft);
        if (timeLeft < 10) {
          this.timeLeft = '0' + timeLeft;
        }
      } else {
        timeLeft = 30;
        this.timeLeft = String(timeLeft);
        clearInterval(this.interval);
        this.timer = true;
        this.settimer = false;
      }
    }, 1000);
  }
  // Validation part
  errorvalidation() {
    if (this.selectedData.userId == '') {
      return 'userId is required!';
    } else if (this.selectedData.password == '') {
      return 'password is required!';
    } else if (this.selectData.phoneNumber == '') {
      return 'phoneNumber is required!';
    } else if (this.selectedOtpData.otp == '') {
      return 'otp is required!';
    } else {
      return 'false';
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
  myErrorStateMatcher(): boolean {
    return true;
  }
  rememberMe() {
    this.isRememberMe = localStorage.getItem('isRememberMe');
    if (this.isRememberMe === 'Yes') {
      this.selectedData.userId = localStorage.getItem('Uname');
      this.selectedData.password = localStorage.getItem('Password');
      this.rememberEnabled = true;
    } else {
      this.selectedData.userId = '';
      this.selectedData.password = '';
    }
  }
}