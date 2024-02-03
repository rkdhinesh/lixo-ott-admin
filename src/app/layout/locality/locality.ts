import { Zone } from "../zone/zone";
import { Header } from '../../shared/services/header';

export class Locality {
  city_id:number
        city: string;
        localityId: number;
        locality_id: number;
        country: string;
        land_mark: string;
        landMark:string;
        pinCode:string;
        locality_name: string;
        localityName: string;
        pin_code: string;
        state: string;
        zoneId: number;
        header:Header;
        zones:Zone;
        iconImage:string;
        popularCity: number;
        editable:boolean;
       
     
        constructor(
                city: string,
                localityId: number,
                locality_id: number,
                locality_name: string,
                pinCode: string,        
                state: string,
                country: string,
                zoneId: number,
                landMark: string,
                iconImage: string,
                popularCity: number){
                this.city=city;
                this.localityId=localityId;
                this.locality_id=locality_id;
                this.locality_name=locality_name;
                this.pin_code=pinCode;
                this.pinCode=pinCode;
                this.state=state;
                this.country=country;
                this.landMark= landMark;
                this.land_mark=landMark;
                this.iconImage=iconImage;
                this.popularCity=popularCity;
                this.zoneId=zoneId;
        }
}
