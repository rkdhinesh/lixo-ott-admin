import { Component, OnInit } from '@angular/core';
import { RestService } from '../../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TempDataService } from '../../shared/temp-dataStore';
import { Company } from './company';
import { UUID } from '../../shared/services/uuid';
import { environment } from '../../../environments/environment';
import { LogService } from '../../shared/services/log.service';
import { ScreenAccessService } from '../../shared/services/screen-access.service';
import { Header } from '../../shared/services/header';
import { LixoDataTableModel } from '../../../app/shared/modules/lixo-data-table/lixo-data-table-model';

/* Jquery declaration**/
declare var $: any;

@Component({
  selector: 'app-company-page',
  templateUrl: './company-page.component.html',
  styleUrls: ['./company-page.component.scss']
})
export class CompanyPageComponent implements OnInit {

  isLoading: boolean = true;
  companyId: number;
  currentUser: any;
  operationAccessMap = new Map();
  errorMessage: string = '';
  displayedColumns = { 'companyName': 'Company Name', 'city': 'City', 'active': 'Active', 'action': 'Action' };
  results: any[] = [];
  lixoDataTableModel = new LixoDataTableModel();

  constructor(private restService: RestService,
    public dialog: MatDialog, public router: Router,
    public tempDataService: TempDataService, public snackBar: MatSnackBar,
    private log: LogService,
    private screenAccess: ScreenAccessService) { }



  /* On load pagenation Event*/
  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    this.companyId = this.currentUser.companyId;
    this.getCompanyData();
    this.screenAccess.loadOperationsAccessForScreen('Zone Management', 'Company');
    this.operationAccessMap = this.screenAccess.map;

    this.lixoDataTableModel.createFlag = this.operationAccessMap.get('Company-Create');
    this.lixoDataTableModel.editFlag = this.operationAccessMap.get('Company-Edit');
    this.lixoDataTableModel.viewFlag = this.operationAccessMap.get('Company-View');
    this.lixoDataTableModel.deleteFlag = this.operationAccessMap.get('Company-Delete');
    this.lixoDataTableModel.editRouterLink = "./edit-company";
    this.lixoDataTableModel.viewRouterLink = "./view-company";
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
    let header = new Header(UUID.UUID());
    let company = <Company>({});
    company.header = header;
    company.companyId = companyId;
    this.restService.post(company, environment.getParticularCompany)
    .map((company: any) => {
      let result: Array<Company> = [];
      if (company) {
        this.isLoading = false;
        company.companies.forEach(erg => {
          result.push(new Company(erg.companyId,
            erg.companyName, erg.country,
            erg.state, erg.city, erg.pinCode, erg.addressLine1,
            erg.addressLine2, erg.landMark, erg.synopsis, erg.website, erg.active));
        });
      }
      this.results = result;
      return result;
    })
    .subscribe(result => {
      this.results = result;
    }, err => {

    });
  }

  private getAllCompanyDetails() {
    let header = new Header(UUID.UUID());
    let company = <Company>({});
    company.header = header;

    this.restService.post(company, environment.viewCompanyPath)
      .map((company: any) => {
        let result: Array<Company> = [];
        if (company) {
          this.isLoading = false;
          company.companies.forEach(erg => {
            result.push(new Company(erg.companyId,
              erg.companyName, erg.country,
              erg.state, erg.city, erg.pinCode, erg.addressLine1,
              erg.addressLine2, erg.landMark, erg.synopsis, erg.website, erg.active));
          });
        }
        this.results = result;
        return result;
      })
      .subscribe(result => {
        this.results = result;
      }, err => {

      });
  }



  /* Delete details**/
  deleteDetail(data: any) {
    let header = new Header(UUID.UUID());
    data.header = header;
    let companyName: string;
    companyName = data.companyName;
    this.restService.post(data, environment.deleteCompanyPath)
      .map((companies: any) => {
        let result: Array<Company> = [];
        if (Company instanceof Array) {
          companies.forEach((erg) => {

            result.push(
              new Company(erg.companyId,
                erg.companyName, erg.country,
                erg.state, erg.city,
                erg.pinCode, erg.addressLine1,
                erg.addressLine2, erg.landMark,
                erg.synopsis, erg.website, erg.active)
            );

          });
          this.results = result;
          return result;
        } else {
          this.log.info("===============" + companies.status["statusCode"]);
          if (companies.status["statusCode"] == '1001') {
            this.openSnackBar(companyName, "Deleted Successfully");
            this.getAllCompanyDetails();
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/company']);

            this.log.info("--------------" + companies.status["statusCode"]);

          }
        }

      })
      .subscribe(result => {
      }, err => {

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
}
