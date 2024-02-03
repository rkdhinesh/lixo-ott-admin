import { Header } from "../../shared/services/header";

export class Charge {
      chargeId: number;
      chargeName: string;
      chargeDescription: string;
      chargeAmount: 0;
      gateWayPercentage: 0;
      vendorPercentage: 0;
     header:Header;
    //  editable:boolean;
     taxIds: Array<any> = [];
     tax: any[] =[];
  
  constructor(
    chargeId: number,
    chargeName:string,
    chargeDescription: string,
    chargeAmount: 0,
    gateWayPercentage: 0,
    vendorPercentage: 0,
    tax: Array<any>
  ){
          this.chargeId = chargeId;
          this.chargeName = chargeName;
          this.chargeDescription = chargeDescription;
          this.chargeAmount = chargeAmount;
          this.gateWayPercentage = gateWayPercentage;
          this.vendorPercentage = vendorPercentage;
          this.taxIds = tax;
  }
  
  
  }