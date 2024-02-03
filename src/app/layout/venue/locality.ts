import { Header } from "../../shared/services/header";

export class Locality {
    
    localityId: number;
    localityName : string;
    pinCode : string;
    city: string;
    state : string;
    country : string;
    header:Header;

    constructor(localityId: number,localityName : string){
        this.localityId = localityId;
        this.localityName = localityName;
    }


}
