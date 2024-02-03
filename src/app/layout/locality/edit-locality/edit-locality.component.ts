import { Component, OnInit } from '@angular/core';
import { LocalityResponse } from '../localityResponse';
import { Locality } from '../locality';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Zone } from '../../zone/zone';
import { startWith, map } from 'rxjs/operators';
import { UUID } from '../../../shared/services/uuid';
import { Headers } from '../../../shared/model/request-header';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';
import { AutoComplete } from '../../../shared/model/auto-complete';
import { CityAutoComplete, StateAutoComplete } from '../../company/add/add-company.component';
import { localityRequestHeader } from '../add-locality/add-locality.component';


@Component({
  selector: 'app-edit-locality',
  templateUrl: './edit-locality.component.html',
  styleUrls: ['./edit-locality.component.scss']
})
export class EditLocalityComponent implements OnInit {

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

  countries: Array<AutoComplete> = [];
  citys: Array<CityAutoComplete> = [];
  filteredCountries: Observable<AutoComplete[]>;
  selectedCountryData: any;
  selectedCityData: any;
  states: Array<StateAutoComplete> = [];
  filteredStates: Observable<StateAutoComplete[]>;
  filteredCitys: Observable<AutoComplete[]>;
  selectedStateData: any;
  countryFormControl: FormControl;
  stateFormControl: FormControl;
  cityFormControl: FormControl;

  zones: Array<AutoComplete> = [];
  filteredZones: Observable<AutoComplete[]>;
  selectedZoneData: any = AutoComplete;
  zoneFormControl: FormControl;

  constructor(private restService: RestService,
    private tempDataService: TempDataService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {
    this.countryFormControl = new FormControl();
    this.stateFormControl = new FormControl();
    this.zoneFormControl = new FormControl();
    this.cityFormControl = new FormControl();
  }

  clear() {

    let localityValue = <Locality>({
      city: '',
      country: '',
      landMark: '',
      locality_name: '',

      pinCode: '',
      state: '',
      zoneId: 0,
      iconImage: '',
      popularCity: 0,
    });

    this.selectedData = localityValue;
  }

  ngOnInit() {
    this.header = <Header>{
      callingAPI: "string",
      channel: "admin",
      transactionId: UUID.UUID()
    }
    this.headers = <Headers>{
      header: this.header
    }
    this.getZones();
    this.tempDataService.currentSelectedData.subscribe(selectedData => this.selectedData = selectedData);


    this.getZones();
    this.filteredZones = this.zoneFormControl.valueChanges
      .pipe(
        startWith<string | AutoComplete>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterZones(name) : this.zones.slice())
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



  filterZones(name: string): AutoComplete[] {
    return this.zones.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }



  filterCitys(name: string): CityAutoComplete[] {
    return this.citys.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
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
        for (let zone of zones) {
          if (zone.code == this.selectedData.zoneId + '') {

            this.selectedZoneData = new AutoComplete(zone.code, zone.name);
          }
        }
      });

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

    if (this.selectedZoneData != null && this.selectedZoneData != 'undefined') {
      this.selectedData.zoneId = this.selectedZoneData.code;
    }
    if (this.selectedCountryData != null && this.selectedCountryData != 'undefined') {
      this.selectedData.country = this.selectedCountryData.name;
    }

    if (this.selectedStateData != null && this.selectedStateData != 'undefined') {
      this.selectedData.state = this.selectedStateData.name;
    }
    if (this.selectedCityData != null && this.selectedCityData != 'undefined') {
      this.selectedData.city = this.selectedCityData.name;
      this.selectedData.city_id = this.selectedCityData.code;
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
    this.restService.put(this.selectedData, environment.updateLocalityPath)
      .subscribe(result => {
        this.log.info(JSON.stringify(result));
        this.openSnackBar(this.selectedData.locality_name, "Updated Successfully");
        this.router.navigate(['/locality']);
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }
  // Validation part 
  validation() {
    if (this.selectedData.city == '') {
      return 'City is required!';
    } else if (this.selectedData.country == '' || this.selectedData.country + '' == 'undefined') {
      return 'country is required!';
    } else if (this.selectedData.locality_name == '') {
      return 'localityName  is required!';
    } else if (this.selectedData.pin_code == '') {
      return 'pinCode is required!';
    } else if (this.selectedData.state == '' || this.selectedData.state + '' == 'undefined') {
      return 'state is required!';
    } else if (this.selectedData.land_mark == '') {
      return 'landMark is required!';
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






