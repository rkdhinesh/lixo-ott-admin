import { Header } from "../../shared/services/header";

export class Company {

  active: number;
  companyId: number;
  companyName: string;
  country: string;
  state: string;
  city: string;
  pinCode: string;
  addressLine1: string;
  addressLine2: string;
  landMark: string;
  synopsis: string;
  website: string;
  header: Header;
  live: boolean;
  editable: boolean;
  constructor(companyId: number,
    companyName: string, country: string,
    state: string, city: string,
    pinCode: string, addressLine1: string,
    addressLine2: string, landMark: string,
    synopsis: string, website: string, active: number) {

    this.companyId = companyId;
    this.companyName = companyName;
    this.country = country;
    this.state = state;
    this.city = city;
    this.pinCode = pinCode;
    this.addressLine1 = addressLine1;
    this.addressLine2 = addressLine2;
    this.landMark = landMark;
    this.synopsis = synopsis;
    this.website = website;
    this.active = active;
    if (this.active == 1) {
      this.live = true;
    } else {
      this.live = false;
    }
  }
}
