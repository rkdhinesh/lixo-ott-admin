import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Header } from '../../../shared/services/header';
import { UUID } from '../../../shared/services/uuid';
import { AuthorizationList } from '../../..//shared/model/AuthorizationList';
import { TempDataService } from '../../../shared/temp-dataStore';
import { LogService } from '../../..//shared/services/log.service';
import { RestService } from '../../../api.service';
import { environment } from '../../../../environments/environment';
import { AuthorizationAccessList } from '../../../shared/model/AuthorizationAccessList';

export class DropDownModel {
  id: number;
  name: string;
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class AddAuthorizeRequestHeader {
  header = new Header(UUID.UUID());
  constructor() { }
}

@Component({
  selector: 'app-add-authorization',
  templateUrl: './add-authorization.component.html',
  styleUrls: ['./add-authorization.component.scss']
})
export class AddAuthorizationComponent implements OnInit {


  selectedData: any;
  isLoading: boolean = true;
  companyList: DropDownModel[] = [];
  header = new Header(UUID.UUID());
  systemList: DropDownModel[] = [];
  selectedCompany: DropDownModel;
  selectedSystem: DropDownModel;
  authorizeList: Array<AuthorizationList> = [];
  newAuthorize: any = {};
  showAuthorize = true;
  dataSource: any;
  classSummaryDisplaycolumns = ["authorizationName", "authorizationDescription"];
  classDataSource: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private company: TempDataService,
    private restService: RestService, private route: ActivatedRoute,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {
  }

  ngOnInit() {
    this.newAuthorize = { company_id: 0,
      system_id: '',authorization_code: "", authorization_description: ""};
    this.authorizeList.push(this.newAuthorize);
    this.loadDefaultValues();
    this.getAllCompanyDetails();
    this.getAllSystemDetails();
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

  loadDefaultValues() {

    let authorize = Array<AuthorizationList>();
     this.selectedData = authorize;


  }
 /* Save Details**/
 public saveDetail() {
  this.log.info("SAVE METHOD");

  if (this.selectedCompany != null) {

    this.selectedData.company_id=this.selectedCompany.id;
  }

  if (this.selectedSystem != null) {

    this.selectedData.system_id= this.selectedSystem.name;
  }


  let validationMessage = this.validation();
  if (validationMessage == false) {
    this.authorizeList.forEach(list =>{
      if (this.selectedCompany != null) {
      list.company_id = this.selectedCompany.id;
      }
      if (this.selectedSystem != null) {
      list.system_id = this.selectedSystem.name;
      }
    });

    this.selectedData=this.authorizeList;
    this.save();
  } else {
    this.openSnackBar("Please fill the red marked fields", validationMessage);
  }
}

  // Validation part
  validation() {
    if (this.selectedData.company_id == 0 || this.selectedData.company_id + '' == 'undefined') {
      return 'Company Name is required!';
    } else if (this.selectedData.system_id == '' || this.selectedData.system_id + '' == 'undefined') {
      return 'System Name is required!';
    }
    else {
      for(let i=0;i<this.authorizeList.length;i++)
      {

        if(this.authorizeList[i].authorization_code == '')
        {
          return 'Authorization Name is required!';
        }
        else if(this.authorizeList[i].authorization_description == '')
        {
          return 'Authorization Description is required!';
        }
      }
      return false;
    }
  }

  public save() {

      this.restService.post(this.selectedData, environment.addAuthorization)
        .subscribe(result => {
          this.log.info(JSON.stringify(result));
          this.openSnackBar(this.selectedCompany.name, "Saved Successfully");
          this.router.navigate(['/authorization']);
       if (result.statusCode === '1004') {
          this.openSnackBar(this.selectedCompany.name, result.statusDescription);
        } else {
          this.openSnackBar(this.selectedCompany.name, result.statusDescription);
        }
      });
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  myErrorStateMatcher(): boolean {
    return true;
  }

  addRow() {
    this.newAuthorize = { company_id: 0,
      system_id: '',authorization_code: "", authorization_description: ""};
      console.log("add row"+this.newAuthorize);
    this.authorizeList.push(this.newAuthorize);

    console.log(this.authorizeList);
    return false;
  }
  deleteRow(index) {
    if(this.authorizeList.length ==1) {
        return false;
    } else {
        this.authorizeList.splice(index, 1);
        return true;
    }
  }
  getAllAuthorizationBasedOnCompanyandSystem()
  {
    if (this.selectedCompany == null || this.selectedCompany.id == 0) {
      return 'Company Name is required!';
    } else if (this.selectedSystem == null || this.selectedSystem.id == 0) {
      return 'System Id is required!';
    }

    this.getAllAuthorization(this.selectedCompany.id,this.selectedSystem.name);
  }
  private getAllAuthorization(companyId:number,systemId:string) {

    this.restService
      .get(environment.getAuthorizationbyCompanyandSystemId+companyId+"/systemId/"+systemId)
      .map((response: any) => {
       let result: Array<AuthorizationAccessList> = [];

        if (response) {
            this.showAuthorize=false;
            response.forEach(erg => {

                let authorize = new AuthorizationAccessList();
                authorize.authorizationId = erg.authorization_id;
                authorize.authorizationName = erg.authorization_code;
                authorize.authorizationDescription=erg.authorization_description;
                authorize.access=false;
                result.push(authorize);
            });
        }
        else
        {
          this.showAuthorize=true;
        }
        return result;
      })
      .subscribe(result => {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
    }, err => { });
  }

}
