import { Component, OnInit } from '@angular/core';
import { AddCity } from './add-city';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Headers } from '../../../shared/model/request-header';
import { Header } from '../../../shared/services/header';
import { UUID } from '../../../shared/services/uuid';
import { RestService } from '../../../api.service';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';
import { AutoComplete } from '../../../shared/model/auto-complete';
import { localityRequestHeader } from '../../locality/add-locality/add-locality.component';
import { StateAutoComplete } from '../../company/add/add-company.component';
import { Zone } from '../../zone/zone';

@Component({
  selector: 'app-add-city',
  templateUrl: './add-city.component.html',
  styleUrls: ['./add-city.component.scss']
})
export class AddCityComponent implements OnInit {

  selectedData: AddCity;
  header = new Header(UUID.UUID());

  filteredCountries: Observable<AutoComplete[]>;
  countryFormControl: FormControl;
  countries: Array<AutoComplete> = [];
  selectedCountryData: any = AutoComplete;

  selectCountry: string;
  filteredStates: Observable<StateAutoComplete[]>;
  stateFormControl: FormControl;
  states: Array<StateAutoComplete> = [];
  selectedStateData: any;

  headers: Headers;
  selectedZoneData: any = Zone;
  filteredZones: Observable<Zone[]>;
  zoneFormControl: FormControl;
  zoneValue: Array<Zone> = [];
  popular: boolean;

  constructor(private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private log: LogService) {
    this.countryFormControl = new FormControl();
    this.stateFormControl = new FormControl();
    this.zoneFormControl = new FormControl();
  }

  ngOnInit() {
    this.headers = <Headers>{
      header: this.header
  }
    this.AddCineastValues();
    this.getAllCountryDetails();
    this.getZones();
    this.filteredCountries = this.countryFormControl.valueChanges
      .pipe(
        startWith<string | AutoComplete>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterCountries(name) : this.countries.slice())
      );
    this.filteredZones = this.zoneFormControl.valueChanges
    .pipe(
      startWith<string | Zone>(''),
      map(value => typeof value === 'string' ? value : value.zoneName),
      map(name => name ? this.filterZones(name) : this.zoneValue.slice())
    );
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  AddCineastValues() {
    const AddCineastValue = <AddCity>{
      city_id: '',
      city: '',
      state: '',
      country: '',
      image_icon: '',
      popular_city: false,
      zone_id: 0

    };
    this.selectedData = AddCineastValue;
  }

  private getZones() {
    this.restService.post(this.headers, environment.getAllZonePath)
        .map((allZones: any) => {
            if (allZones) {
                allZones.zones.forEach((erg) => {
                    this.zoneValue.push(new Zone(erg.zoneId, erg.zoneName));
                });
            }
            return this.zoneValue;
        })
        .subscribe(zones => {
            this.selectedZoneData = zones;
        })
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
        console.log("countries" + countries)
        this.selectedCountryData = countries;
      });

  }

  displayFn(selectedData?: AutoComplete): string | undefined {
    return selectedData ? selectedData.name : undefined;
  }

  displayZoneFn(selectedData?: Zone): string | undefined {
    return selectedData ? selectedData.zoneName : undefined;
  }

  filterCountries(name: string): AutoComplete[] {
    return this.countries.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterStates(name: string): StateAutoComplete[] {
    return this.states.filter(option =>
      option.name.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  filterZones(name: string): Zone[] {
    return this.zoneValue.filter(option =>
      option.zoneName.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  displayStateFn(selectedData?: StateAutoComplete): string | undefined {
    return selectedData ? selectedData.name : undefined;
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

  private getAllStateDetailsByCountry(country: string) {
    this.states = [];
    let stateRequest = <localityRequestHeader>({});
    stateRequest.header = this.header;
    stateRequest.countryCode = country;

    this.restService.post(stateRequest, environment.getAllStates)
      .map((res: any) => {
        if (res) {
          res.regions.forEach((erg) => {

            this.states.push(new StateAutoComplete(erg.regionCode, erg.regionName, erg.country));

          });
        }
        return this.states;
      }).subscribe(states => {
        this.selectedStateData = states;
      });

  }

  public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.selectedCountryData != null && this.selectedCountryData != 'undefined') {
      this.selectedData.country = this.selectedCountryData.name;
    }
    if (this.selectedStateData != null && this.selectedStateData != 'undefined') {
      this.selectedData.state = this.selectedStateData.name;
    }
    if (this.selectedZoneData != null && this.selectedZoneData != 'undefined') {
      this.selectedData.zone_id = this.selectedZoneData.zoneId;
    }
    let validationMessage = this.validation();
    if (validationMessage == false) {
      this.save();
    } else {
      this.openSnackBar("Please fill the red marked fields", validationMessage);
    }
  }



  validation() {
    if (this.selectedData.city == '') {
      return 'City is required!';
    } else if (this.selectedData.country == '' || this.selectedData.country + '' == 'undefined') {
      return 'country is required!';
    } else if (this.selectedData.state == '' || this.selectedData.state + '' == 'undefined') {
      return 'state is required!';
    }
    if (this.selectedData.zone_id == 0) {
      return 'Zone id is required!';
    }
    else {
      return false;
    }
  }


  public save() {
   
    this.selectedData.header = this.header;
    this.restService.post(this.selectedData, environment.addcity)
      .subscribe(res => {
        console.log("res" + JSON.stringify(res));
        this.openSnackBar(this.selectedData.city, "Saved Successfully");
        this.router.navigate(['/city']);

      },
        err => {
          console.log(err);
          // check error status code is 500, if so, do some action
        });

  }

}
