import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from "../../../api.service";
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Company } from '../company';
import { map, startWith } from 'rxjs/operators';
import { Header } from '../../../shared/services/header';
import { UUID } from '../../../shared/services/uuid';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { Status } from '../../../shared/model/response-status-model';
import { AutoComplete } from '../../../shared/model/auto-complete';

export class CompanyRequestHeader {
  header: Header;
  countryCode: string;
  constructor() { }
}

export class CityAutoComplete {
  constructor(public code: string, public name: string, public country: string, public state: string) { }

}
export class StateAutoComplete {
  constructor(public code: string, public name: string, public country: string) { }
}


@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent implements OnInit {

  selectedData: Company;
  countries: Array<AutoComplete> = [];
  filteredCountries: Observable<AutoComplete[]>;
  selectedCountryData: any = AutoComplete;
  states: Array<StateAutoComplete> = [];
  filteredStates: Observable<StateAutoComplete[]>;
  selectedStateData: any;
  header = new Header(UUID.UUID());
  countryFormControl: FormControl;
  stateFormControl: FormControl;
  cityFormControl: FormControl;
  citys: Array<CityAutoComplete> = [];
  selectedCityData: any;
  filteredCitys: Observable<CityAutoComplete[]>;
  country: string;
  constructor(private restService: RestService, private route: ActivatedRoute,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {
    this.countryFormControl = new FormControl();
    this.stateFormControl = new FormControl();
    this.cityFormControl = new FormControl();

  }
  loadDefaultValues() {
    let company = <Company>({
      companyName: '',
      country: '', state: '',
      city: '', pinCode: '',
      addressLine1: '', addressLine2: '',
      landMark: '', synopsis: '', website: ''
    });
    company.live = true;

    this.selectedData = company;
  }

  ngOnInit() {
    this.loadDefaultValues();

    this.getAllCountryDetails();
    this.filteredCountries = this.countryFormControl.valueChanges
      .pipe(
        startWith<string | AutoComplete>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterCountries(name) : this.countries.slice())
      );
    this.getAllCityDetails();
    this.filteredCitys = this.cityFormControl.valueChanges
      .pipe(
        startWith<string | CityAutoComplete>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterCitys(name) : this.citys.slice())

      );


  }


  onSelectCity(citys) {
    this.selectedData.city = citys;
  }


  displayFn(selectedData?: AutoComplete): string | undefined {
    return selectedData ? selectedData.name : undefined;
  }



  filterCountries(name: string): AutoComplete[] {
    return this.countries.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }



  filterCitys(name: string): CityAutoComplete[] {
    return this.citys.filter(option =>

      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);

  }

  private getAllCountryDetails() {

    let countryRequest = <CompanyRequestHeader>({});
    countryRequest.header = this.header;;

    this.restService.post(countryRequest, environment.getAllCountries)
      .map((res: any) => {
        if (res) {
          res.countries.forEach((erg) => {

            this.countries.push(new AutoComplete(erg.code, erg.name));

          });
        }
        return this.countries;

      }).subscribe(countries => {
        this.selectedCountryData = countries;
      });

  }


  private getAllCityDetails() {
    this.citys = [];
    this.restService.get(environment.getcity)
      .map((res: any) => {
        if (res) {
          res.forEach((erg) => {

            this.citys.push(new CityAutoComplete(erg.code, erg.city, erg.country, erg.state));

          });
        }
        return this.citys;

      }).subscribe(citys => {
        this.selectedCityData = citys;
      });


  }


  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.selectedCityData != null && this.selectedCityData != 'undefined') {
      this.selectedData.city = this.selectedCityData.name;

      this.selectedData.country = this.selectedCityData.country;
      this.selectedData.state = this.selectedCityData.state;

    }

    let validationMessage = this.validation();
    if (validationMessage == false) {
      this.save();
    } else {
      this.openSnackBar("Please fill the red marked fields", validationMessage);
    }
  }
  private save() {

    this.selectedData.header = this.header;
    this.selectedData.active = 0;
    if (this.selectedData.live == true) {
      this.selectedData.active = 1;
    }

    this.restService.post(this.selectedData, environment.addCompanyPath)
      .map((res: any) => {
        return new Status(res.status["statusCode"], res.status["statusDescription"], res.status['transactionId']);
      })
      .subscribe(result => {

        this.log.info(JSON.stringify(result));
        if (result.statusCode == '1001') {
          this.openSnackBar(this.selectedData.companyName, "Saved Successfully");
          this.router.navigate(['/company']);
        } else {
          this.openSnackBar(this.selectedData.companyName, result.statusDescription);
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  // Validation part 
  validation() {
    if (this.selectedData.companyName == '') {
      return 'Company Name is required!';
    }
    else if (this.selectedData.country == '' || this.selectedData.country + '' == 'undefined') {
      return 'Country is  required!';
    } else if (this.selectedData.state == '' || this.selectedData.state + '' == 'undefined') {
      return 'State is required!';
    }
    else if (this.selectedData.pinCode == '') {
      return 'Pincode is required!';
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


}