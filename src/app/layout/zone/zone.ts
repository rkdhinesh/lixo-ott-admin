import { Header } from "../../shared/services/header";

export class Zone {
    zoneId:number;
    zoneName:string;
    header:Header;
    status:boolean;
    editable:boolean;

    constructor(zoneId:number,zoneName:string){
        this.zoneId=zoneId;
        this.zoneName=zoneName;
    }
}

