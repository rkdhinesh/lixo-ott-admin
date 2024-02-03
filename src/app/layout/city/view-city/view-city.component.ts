import { Component, OnInit } from '@angular/core';
import { AddCity } from '../add-city/add-city';
import { UUID } from '../../../shared/services/uuid';
import { Header } from '../../../shared/services/header';
import { Headers } from '../../../shared/model/request-header';
import { TempDataService } from '../../../shared/temp-dataStore';
import { Zone } from '../../zone/zone';
import { RestService } from '../../../api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view-city',
  templateUrl: './view-city.component.html',
  styleUrls: ['./view-city.component.scss']
})
export class ViewCityComponent implements OnInit {

  headers: Headers;
  selectedData: AddCity;
  
  buttonStatus:boolean;
  error: string;
  header = new Header(UUID.UUID());
  zoneValue: Array<Zone> = [];
  selectedZoneData: any = Zone;
  zoneName: string;
  popular: boolean;

  constructor(private restService: RestService,
    private tempDataService: TempDataService) { }

  clear() {
    const cineastMember = <AddCity>{

city_id:'',
city:'',
state:'',
country:'',
image_icon:'',
popular_city:false,
zone_id:0


    };
    this.selectedData = cineastMember;
  }

  ngOnInit() {

    this.headers = <Headers>{
      header: this.header
    };

    this.getZones();
    this.tempDataService.currentSelectedData.subscribe(
      selectedData => (this.selectedData = selectedData)
    );
    this.buttonStatus = this.selectedData.editable;
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
            this.selectedZoneData = zones;            
            this.zoneName = zones.find(option =>
            option.zoneId == this.selectedData.zone_id).zoneName;
        })
}
  
}
