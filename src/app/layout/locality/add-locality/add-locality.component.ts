import { Component, OnInit } from '@angular/core';
import { Locality } from '../locality';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { LocalityResponse } from '../localityResponse';
import { startWith, map } from 'rxjs/operators';
import { UUID } from '../../../shared/services/uuid';
import { Zone } from '../../zone/zone';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';
import { Headers } from '../../../shared/model/request-header';
import { CityAutoComplete, StateAutoComplete } from '../../company/add/add-company.component';
import { AutoComplete } from '../../../shared/model/auto-complete';
import { Header } from '../../../shared/services/header';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';


export class localityRequestHeader {
  header: Header;
  countryCode: string;
  constructor() { }
}

@Component({
  selector: 'app-add-locality',
  templateUrl: './add-locality.component.html',
  styleUrls: ['./add-locality.component.scss']
})
export class AddLocalityComponent implements OnInit {

  data: any;
  selectedData: Locality;
  responseData: LocalityResponse;
  isSuccess: boolean = true;
  items: Locality[] = [];
  ioObjArray: Locality[] = [];
  zone: Zone;
  result: Zone[] = [];
  headers: Headers;
  header = new Header(UUID.UUID());
  selectCountry:string;
  selectCity:string;
  countries: Array<AutoComplete> = [];
  filteredCountries: Observable<AutoComplete[]>;
  selectedCountryData: any = AutoComplete;
  states: Array<StateAutoComplete> = [];
  citys:Array<CityAutoComplete> = [];
  filteredStates: Observable<StateAutoComplete[]>;
  filteredCitys:Observable<AutoComplete[]>;
  selectedStateData: any;
  selectedCityData:any;
  countryFormControl: FormControl;
  stateFormControl: FormControl;
  cityFormControl:FormControl;
  dataSource: any;
  zones: Array<AutoComplete> = [];
  filteredZones: Observable<AutoComplete[]>;
  selectedZoneData: any = AutoComplete;
  zoneFormControl: FormControl;
  isLoading: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  

  constructor(private restService: RestService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {
    this.countryFormControl = new FormControl();
    this.stateFormControl = new FormControl();
    this.zoneFormControl = new FormControl();
    this.cityFormControl = new FormControl();
  }

  loadDefaultValues() {

    let localityValue = <Locality>({
      city: '',
      country: '',
      land_mark: '',
      locality_name: '',
      pin_code: '',
      state: '',
      zoneId: 0,
      iconImage: '',
      popularCity: 0,
    });
    this.selectedData = localityValue;

  }

  ngOnInit() {

    this.headers = <Headers>{
      header: this.header
    }

    this.loadDefaultValues();

    this.getAllCountryDetails();
    this.filteredCountries = this.countryFormControl.valueChanges
      .pipe(
        startWith<string | AutoComplete>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterCountries(name) : this.countries.slice())
      );

   
    this. getAllCityDetails();
    this.filteredCitys = this.cityFormControl.valueChanges
      .pipe(
        startWith<string | CityAutoComplete>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this. filterCitys(name) : this.citys.slice())
      );

    this.getZones();
    this.filteredZones = this.zoneFormControl.valueChanges
      .pipe(
        startWith<string | AutoComplete>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterZones(name) : this.zones.slice())
      );
   
  }

  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");
    
    if (this.selectedCountryData != null && this.selectedCountryData != 'undefined') {
      this.selectedData.country = this.selectedCityData.country;
    }

    if (this.selectedStateData != null && this.selectedStateData != 'undefined') {
        this.selectedData.state  =this.selectedCityData.state;
    }
    if (this.selectedCityData != null && this.selectedCityData != 'undefined') {
      this.selectedData.city_id = this.selectedCityData.code;
      this.selectedData.city = this.selectedCityData.name;
     
     
    }
    let validationMessage = this.validation();
    if (validationMessage == false) {
      if (this.selectedData.popularCity) {
        this.selectedData.popularCity = 1;
      }
      else {
        this.selectedData.popularCity = 0;
      }
      this.save();
    } else {
      this.openSnackBar("Please fill the red marked fields", validationMessage);
    }
  }
  private save() {
    this.restService.post(this.selectedData, environment.addLocalityPath)
      .subscribe(result => {
        this.log.info(JSON.stringify(result));
          this.openSnackBar(this.selectedData.locality_name, "Saved Successfully");
          this.router.navigate(['/locality']);
       if (result.statusCode === '1004') {
          this.openSnackBar(this.selectedData.locality_name, result.statusDescription);
        } else {
          this.openSnackBar(this.selectedData.locality_name, result.statusDescription);
        }
      });
  }


  

  // Validation part 
  validation() {
    if (this.selectedData.city == '') {
      return 'City is required!';
     } 
    else if (this.selectedData.country == '' || this.selectedData.country + '' == 'undefined') {
      return 'country is required!';
    } 
    else if (this.selectedData.locality_name == '') {
      return 'localityName  is required!';
    } else if (this.selectedData.pin_code == '') {
      return 'pinCode is required!';
    }
     else if (this.selectedData.state == '' || this.selectedData.state + '' == 'undefined') {
      return 'state is required!';
    }
    else if (this.selectedData.land_mark == '') {
      return 'landMark is required!';
    }
    else {
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

  private getAllCountryDetails() {

    let countryRequest = <localityRequestHeader>({});
    countryRequest.header = this.header;

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
  displayFn(selectedData?: AutoComplete): string | undefined {
    return selectedData ? selectedData.name : undefined;
  }

  displayStateFn(selectedData?: StateAutoComplete): string | undefined {
    return selectedData ? selectedData.name : undefined;
  }

  filterZones(name: string): AutoComplete[] {
    return this.zones.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterCountries(name: string): AutoComplete[] {
    return this.countries.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterStates(name: string): StateAutoComplete[] {
    return this.states.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterCitys(name: string): CityAutoComplete[] {
    return this.citys.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }
  onSelect(country: string) {
     this.selectCountry = country;
     this.getAllStateDetailsByCountry(country);
     this.filteredStates = this.stateFormControl.valueChanges
      .pipe(
        startWith<string | StateAutoComplete>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterStates(name) : this.states.slice())
      );

  }

   onSelectCity(citys){
    this.selectedData.city = citys;
  
   }
 

  private getAllStateDetailsByCountry(country: string) {
    this.states = [];
    let stateRequest = <localityRequestHeader>({});
    stateRequest.header = this.header;
    stateRequest.countryCode = country;

    this.restService.post(stateRequest, environment.getAllStates)
      .map((res: any) => {
        if (res) {
          res.regions.forEach((erg) => {
            console.log("state "+JSON.stringify(erg.Country))

            this.states.push(new StateAutoComplete(erg.regionCode, erg.regionName, erg.country));

          });
        }
        return this.states;
      }).subscribe(states => {
        this.selectedStateData = states;
      });

  }

  private getZones() {

    let countryRequest = <localityRequestHeader>({});
    countryRequest.header = this.header;;

    this.restService.post(countryRequest, environment.getAllZonePath)
      .map((res: any) => {
        if (res) {
          res.zones.forEach((erg) => {

            this.zones.push(new AutoComplete(erg.zoneId, erg.zoneName));

          });
        }
        return this.zones;
      }).subscribe(zones => {
        this.selectedZoneData = zones;
      });

  }
 

     
     
 private  getAllCityDetails(){
    this.citys = [];
    this.restService.get(environment.getcity)
    .map((res: any) => {
      if (res) {
        res.forEach((erg) => {
          console.log("this city id"+JSON.stringify(erg.city_id));

          this.citys.push(new CityAutoComplete(erg.city_id,erg.city,erg.country,erg.state ));

        });
      }
      return this.citys;
    }).subscribe(citys => {
     
      this.selectedCityData = citys;
    });

}



}

