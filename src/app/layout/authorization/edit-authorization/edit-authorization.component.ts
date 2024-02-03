import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../../api.service';
import { LogService } from '../../../shared/services/log.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Header } from '../../../shared/services/header';
import { UUID } from '../../../shared/services/uuid';
import { environment } from '../../../../environments/environment';
import { Authorization } from '../../../shared/model/authorization';
import { FormGroup } from '@angular/forms';
import { TempDataService } from '../../../shared/temp-dataStore';

export class DropDownModel {
  id: number;
  name: any;
  constructor(id: number, name: any) {
    this.id = id;
    this.name = name;
  }
}

export class AddAuthorizeRequestHeader {
  header = new Header(UUID.UUID());
  constructor() { }
}

@Component({
  selector: 'app-edit-authorization',
  templateUrl: './edit-authorization.component.html',
  styleUrls: ['./edit-authorization.component.scss']
})

export class EditAuthorizationComponent implements OnInit {

  selectedData: Authorization;
  isLoading: boolean = true;
  companyList: DropDownModel[] = [];
  header = new Header(UUID.UUID());
  systemList: DropDownModel[] = [];
  role_form: FormGroup;
  selectedCompany: any;
  selectedSystem: any;

  constructor(
    private tempDataService: TempDataService,
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private log: LogService
  ) { }

  clear() {
    const authorize = <Authorization>{

      authorization_id: 0,
      authorization_code: '',
      authorization_description: '',
      company_id: 0,
      system_id: ' ',
      companyName: '',
    };
    this.selectedData = authorize;
  }
  ngOnInit() {

    this.getAllCompanyDetails();
    this.getAllSystemDetails();
    this.clear();


    this.tempDataService.currentSelectedData.subscribe(
      selectedData => (this.selectedData = selectedData)

    );
    console.log("selected data" + this.selectedData)
    this.restService
      .get(environment.getAuthorizationById + this.selectedData.authorization_id)
      .map((response: any) => {
        let result: Authorization;
        if (response) {
          result = response;
          this.selectedData.authorization_id = response.authorization_id;
          this.selectedData.authorization_code = result.authorization_code;
          this.selectedData.authorization_description = result.authorization_description;
          this.selectedData.company_id = result.company_id;
          this.selectedData.system_id = result.system_id;
          this.selectedCompany = this.selectedData.company_id;
          this.selectedSystem = this.selectedData.system_id;
        }
        this.log.info(JSON.stringify(this.selectedData));
        return result;
      })
      .subscribe(
        result => { },
        err => { }
      );


  }

  private editCompany(data: any) {
    let dropDownData = this.companyList.find((data: any) => data.company_id === this.selectedCompany.id);
    if (dropDownData) {
      this.companyList.push(new DropDownModel(dropDownData.id, dropDownData.name));
    }
  }

  private getAllCompanyDetails() {
    this.companyList = [];
    let request = new AddAuthorizeRequestHeader();
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
  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.selectedCompany != null) {
      this.selectedData.company_id = this.selectedCompany;
    }

    if (this.selectedSystem != null) {
      this.selectedData.system_id = this.selectedSystem;
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
    if (this.selectedData.company_id == 0 || this.selectedData.company_id + '' == 'undefined') {
      return 'Company id is required!';
    } else if (this.selectedData.system_id == '' || this.selectedData.system_id + '' == 'undefined') {
      return 'System id is required!';
    } else if (this.selectedData.authorization_code == '' || this.selectedData.authorization_code + '' == 'undefined') {
      return 'Authorization Name is required!';
    } else if (this.selectedData.authorization_description == '' || this.selectedData.authorization_description + '' == 'undefined') {
      return 'Authorization Description is required!';
    } else {
      return false;
    }
  }
  public save() {

    this.restService
      .put(
        this.selectedData,
        environment.updateAuthorization
      )
      .subscribe(
        result => {
          this.log.info(JSON.stringify(result));
          this.openSnackBar(this.selectedData.authorization_code, 'Saved Successfully');
          this.router.navigate(['/authorization']);

        });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }
  myErrorStateMatcher(): boolean {
    return true;
  }

}
