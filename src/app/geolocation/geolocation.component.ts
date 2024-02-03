import { Component, OnInit } from '@angular/core';
import { GeolocationService } from './geolocation.service';

@Component({
  selector: 'app-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.css']
})
export class GeolocationComponent implements OnInit {

  isCCIndia: boolean;
  isVpn: boolean;
  ipAddress: string = '';
  countryCode: string = '';

  constructor(private geolocationService: GeolocationService) { }

  ngOnInit(): void {
    this.isCCIndia = this.geolocationService.getIsCCIndia();
    this.isVpn = this.geolocationService.getIsVpn();
    this.ipAddress = this.geolocationService.getIpAddress();
    this.countryCode = this.geolocationService.getCountryCode();
  }

}
