import { Component, OnInit } from '@angular/core';
import { AddCity } from '../add-city/add-city';
import { Headers } from '../../../shared/model/request-header';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { Header } from '../../../shared/services/header';
import { UUID } from '../../../shared/services/uuid';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';
import { AutoComplete } from '../../../shared/model/auto-complete';
import { StateAutoComplete } from '../../company/add/add-company.component';
import { localityRequestHeader } from '../../locality/add-locality/add-locality.component';
import { Zone } from '../../zone/zone';

@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrls: ['./edit-city.component.scss']
})
export class EditCityComponent implements OnInit {
  headers: Headers;
  selectedData: AddCity;


  error: string;
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

  selectedZoneData: any = Zone;
  filteredZones: Observable<Zone[]>;
  zoneFormControl: FormControl;
  zoneValue: Array<Zone> = [];
  popular: boolean;

  constructor(private tempDataService: TempDataService,
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private log: LogService) {
    this.countryFormControl = new FormControl();
    this.stateFormControl = new FormControl();
    this.zoneFormControl = new FormControl();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  clear() {
    const cineastMember = <AddCity>{

      city_id: '',
      city: '',
      state: '',
      country: '',
      zone_id: 0,
      image_icon: '',
      popular_city: false,
    };
    this.selectedData = cineastMember;
  }

  ngOnInit() {
    this.headers = <Headers>{
      header: this.header
    };
    this.clear();
    this.log.info('EDIT METHOD');
    this.tempDataService.currentSelectedData.subscribe(
      selectedData => (this.selectedData = selectedData)
    );
       
    this.getAllCountryDetails();
    this.filteredCountries = this.countryFormControl.valueChanges
      .pipe(
        startWith<string | AutoComplete>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this.filterCountries(name) : this.countries.slice())
      );

    this.getZones();
    this.selectedZoneData.zoneId = this.selectedData.zone_id;
    this.filteredZones = this.zoneFormControl.valueChanges
      .pipe(
        startWith<string | Zone>(''),
        map(value => typeof value === 'string' ? value : value.zoneName),
        map(name => name ? this.filterZones(name) : this.zoneValue.slice())
      );
    if(this.selectedData.popular_city == true) {
        this.popular = true;
    } else {
        this.popular = false;
    }
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
          for (let zone of zones) {
            if (zone.zoneId == this.selectedData.zone_id) {
              this.selectedZoneData = new Zone(zone.zoneId, zone.zoneName);
              break;
            }
          }
        });
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
        for (let country of countries) {
          if (country.name == this.selectedData.country) {

            this.selectedCountryData = new AutoComplete(country.code, country.name);
            this.getAllStateDetailsByCountry(country.code);
            this.filteredStates = this.stateFormControl.valueChanges
              .pipe(
                startWith<string | StateAutoComplete>(''),
                map(value => typeof value === 'string' ? value : value.name),
                map(name => name ? this.filterStates(name) : this.states.slice())
              );
            break;
          }
        }
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

  displayStateFn(selectedData?: StateAutoComplete): string | undefined {
    return selectedData ? selectedData.name : undefined;
  }

  filterZones(name: string): Zone[] {
    return this.zoneValue.filter(option =>
      option.zoneName.toLowerCase().indexOf(name.toLowerCase()) === 0);
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
        for (let state of states) {
          if (state.name == this.selectedData.state) {
            this.selectedStateData = new AutoComplete(state.code, state.name);
            break;
          }
        }
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
    this.save();
  }


  public save() {
    this.selectedData.header = this.header;

    this.restService.put(this.selectedData, environment.editcity)
      .subscribe(result => {
        this.openSnackBar(this.selectedData.city, "Update Successfully");
        this.router.navigate(['/city']);

      },
      );


  }


}
