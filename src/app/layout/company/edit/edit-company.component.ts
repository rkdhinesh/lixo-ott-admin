import { Component, OnInit } from '@angular/core';
import { Company } from '../company';
import { Observable } from 'rxjs';
import { StateAutoComplete, CityAutoComplete } from '../add/add-company.component';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { startWith, map } from 'rxjs/operators';
import { TempDataService } from '../../../shared/temp-dataStore';
import { LogService } from '../../../shared/services/log.service';
import { AutoComplete } from '../../../shared/model/auto-complete';
import { Header } from '../../../shared/services/header';
import { UUID } from '../../../shared/services/uuid';
import { environment } from '../../../../environments/environment';
import { Status } from '../../../shared/model/response-status-model';
import { RestService } from '../../../api.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})
export class EditCompanyComponent implements OnInit {

  selectedData: Company;
  countries: Array<AutoComplete> = [];
  filteredCountries: Observable<AutoComplete[]>;
  selectedCountryData: any = AutoComplete;
  states: Array<StateAutoComplete> = [];
  filteredStates: Observable<StateAutoComplete[]>;
  selectedStateData: any;
  header: Header;
  countryFormControl: FormControl;
  stateFormControl: FormControl;
  cityFormControl: FormControl;
  citys: Array<CityAutoComplete> = [];
  selectedCityData: any;
  filteredCitys: Observable<CityAutoComplete[]>;

  constructor(private restService: RestService, private tempDataService: TempDataService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {
    this.countryFormControl = new FormControl();
    this.stateFormControl = new FormControl();
    this.cityFormControl = new FormControl();

  }


  ngOnInit() {

    this.header = <Header>{
      callingAPI: "string",
      channel: "admin",
      transactionId: UUID.UUID()
    }

    this.tempDataService.currentSelectedData.subscribe(selectedData => this.selectedData = selectedData);

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


  displayCityFn(selectedData?: CityAutoComplete): string | undefined {
    return selectedData ? selectedData.name : undefined;
  }



  filterCitys(name: string): CityAutoComplete[] {
    return this.citys.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  private getAllCityDetails() {
    this.citys = [];
    this.restService.get(environment.getcity)
      .map((res: any) => {
        if (res) {
          res.forEach((erg) => {

            this.citys.push(new CityAutoComplete(erg.city_id, erg.city, erg.country, erg.state));

          });
        }
        return this.citys;
      }).subscribe(citys => {

        for (let city of citys) {
          if (city.name == this.selectedData.city) {
            this.selectedCityData = new AutoComplete(city.code, city.name);
            break;
          }
        }

      });

  }


  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.selectedCountryData != null && this.selectedCountryData != 'undefined') {
      this.selectedData.country = this.selectedCountryData.name;
    }

    if (this.selectedStateData != null && this.selectedStateData != 'undefined') {
      this.selectedData.state = this.selectedStateData.name;
    }
    if (this.selectedCityData != null && this.selectedCityData != 'undefined') {
      this.selectedData.city = this.selectedCityData.name;
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

    this.restService.post(this.selectedData, environment.updateCompanyPath)
      .map((res: any) => {
        return new Status(res.status["statusCode"], res.status["statusDescription"], res.status['transactionId']);
      })
      .subscribe(result => {
        this.log.info(JSON.stringify(result));
        if (result.statusCode == '1001') {
          this.openSnackBar(this.selectedData.companyName, "Updated Successfully");
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
    } else if (this.selectedData.country == '' || this.selectedData.country == undefined) {
      return 'Country is required!';
    } else if (this.selectedData.state == '' || this.selectedData.state == undefined) {
      return 'State is required!';
    } else if (this.selectedData.pinCode == '') {
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
