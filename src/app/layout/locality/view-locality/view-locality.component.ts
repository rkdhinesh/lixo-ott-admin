import { Component, OnInit } from '@angular/core';
import { LocalityResponse } from '../localityResponse';
import { Locality } from '../locality';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Zone } from '../../zone/zone';
import { UUID } from '../../../shared/services/uuid';
import { Country } from '../../../shared/model/country';
import { State } from '../../../shared/model/state';
import { Headers } from '../../../shared/model/request-header';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';

@Component({
  selector: 'app-view-locality',
  templateUrl: './view-locality.component.html',
  styleUrls: ['./view-locality.component.scss']
})
export class ViewLocalityComponent implements OnInit {
  data: any;
  selectedData: Locality;
  responseData: LocalityResponse;


  countries: Country[];
  country: Country;
  states: State[];
  zone: Zone[];
  result: Zone[] = [];
  totalItems: Zone[] = [];
  buttonStatus: boolean;
  header = new Header(UUID.UUID());
  headers: Headers;
  constructor(private tempDataService: TempDataService, private restService: RestService,
    private router: Router, public snackBar: MatSnackBar,
    private log: LogService) { }
  myControl: FormControl = new FormControl();
  countryControl: FormControl = new FormControl({ value: '', disabled: '' });
  stateControl: FormControl = new FormControl({ value: '', disabled: '' });
  zoneControl: FormControl = new FormControl({ value: '', disabled: '' });

  clear() {

    let localityValue = <Locality>({
      city: '',
      country: '',
      landMark: '',
      localityName: '',
      pinCode: '',
      state: '',
      zoneId: 0,
      iconImage: '',
      popularCity: 0,
    });

    this.selectedData = localityValue;
    this.countries = this.getCountries();
    this.states = this.getStates();
    //this.zone = this.result;
  }
  ngOnInit() {
  
    this.headers = <Headers>{
      header: this.header
    }
    this.getZones();
    this.log.info("EDIT METHOD");
    this.tempDataService.currentSelectedData.subscribe(selectedData => this.selectedData = selectedData);
    this.buttonStatus = this.selectedData.editable;
    this.countryControl = new FormControl({ value: '', disabled: this.buttonStatus })
    this.zoneControl = new FormControl({ value: '', disabled: this.buttonStatus })
    this.stateControl = new FormControl({ value: '', disabled: this.buttonStatus })
    this.log.info("EDIT METHOD=====" + JSON.stringify(this.selectedData));
    JSON.stringify(this.selectedData);
    this.countries = this.getCountries();
    this.states = this.getStates();

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  myErrorStateMatcher(): boolean {
    return true;
  }


  onSelect(countryId) {
    this.states = this.getStates().filter((item) => item.countryId == countryId);
    this.stateControl.reset();
  }

  getCountries() {
    return [
      new Country(1, 'United States'),
      new Country(2, 'India'),
      new Country(3, 'Australia'),
      new Country(4, 'New Zealand'),
      new Country(5, 'South Africa'),
      new Country(6, 'United Kingdom')
    ];
  }

  getStates() {
    return [
      new State(1, 1, 'Alabama'),
      new State(2, 1, 'Alaska'),
      new State(3, 1, 'Arizona'),
      new State(5, 1, 'Arkansas'),
      new State(6, 1, 'California'),
      new State(7, 1, 'Colorado'),
      new State(8, 1, 'Connecticut'),
      new State(9, 1, 'Delaware'),
      new State(10, 1, 'Florida'),
      new State(11, 1, 'Georgia'),
      new State(12, 1, 'Hawaii'),
      new State(13, 1, 'Idaho'),
      new State(14, 1, 'Illinois'),
      new State(15, 1, 'Indiana'),
      new State(16, 2, 'New Delhi'),
      new State(17, 2, 'Maharashtra'),
      new State(18, 2, 'Goa'),
      new State(19, 2, 'Punjab'),
      new State(20, 2, 'Haryana'),
      new State(21, 2, 'Uttar Pradesh'),
      new State(22, 2, 'Rajasthan'),
      new State(23, 2, 'Andhra Pradesh'),
      new State(24, 2, 'Jharkhand'),
      new State(25, 2, 'Madhya Pradesh'),
      new State(26, 3, 'New South Wales'),
      new State(27, 3, 'Tasmania'),
      new State(28, 3, 'Qweensland'),
      new State(29, 3, 'Western Australia'),
      new State(30, 3, 'Victoria'),
      new State(31, 4, 'Auckland'),
      new State(32, 4, 'Wellington'),
      new State(33, 4, 'Christchurch'),
      new State(34, 4, 'Hamilton'),
      new State(35, 4, 'Napier'),
      new State(31, 5, 'Eastern Cape'),
      new State(32, 5, 'Limpopo'),
      new State(33, 5, 'Mpumalanga'),
      new State(34, 5, 'North West'),
      new State(35, 5, 'Northern Cape'),
      new State(31, 6, 'Herefordshire'),
      new State(32, 6, 'Durham'),
      new State(33, 6, 'Manchester'),
      new State(34, 6, 'South Yorkshire'),
      new State(35, 6, 'Birmingham'),
      new State(36, 2, 'Tamil Nadu'),
    ];
  }
  displayFn(zones?: Zone): string | undefined {
    return zones ? zones.zoneName : undefined;
  }


  private getZones() {
    this.restService.post(this.headers, environment.getAllZonePath)
      .map((allZones: Array<any>) => {
        if (allZones) {
          let zonesArray = allZones["zones"];
          zonesArray.forEach((erg) => {
            this.result.push(new Zone(erg.zoneId, erg.zoneName));
          });
        }
        this.totalItems = this.result;
        return this.result;
      })
      .subscribe(zones => {
       

      })
  }


  editStatus() {
    if (this.buttonStatus) {
      this.buttonStatus = false;
      this.countryControl.enable();
      this.stateControl.enable();
      this.zoneControl.enable();
    }
   
  }

}






