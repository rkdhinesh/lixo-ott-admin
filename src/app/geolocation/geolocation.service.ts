import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class GeolocationService {

    isCCIndia: boolean;
    isVpn: boolean;
    ipAdress: string = '';
    countryCode: string = '';

    constructor() {}

    checkConnection(isCc: boolean, vpn: boolean, ip: string, cc: string) {
        this.isCCIndia = isCc;
        this.isVpn = vpn;
        this.ipAdress = ip;
        this.countryCode = cc
    }

    getIsVpn() {
        return this.isVpn;
    }

    getIsCCIndia() {
        return this.isCCIndia;
    }

    getIpAddress() {
        return this.ipAdress;
    }

    getCountryCode() {
        return this.countryCode;
    }
}