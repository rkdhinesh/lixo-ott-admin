import { Header } from "../../shared/services/header";

export class VenueCategory {
    
    venueCategoryId: number;
    venueCategoryName : string;
    synopsis : string;
    header:Header;

    constructor(venueCategoryId: number,
        venueCategoryName : string,synopsis : string){
            this.venueCategoryId = venueCategoryId;
            this.venueCategoryName = venueCategoryName;
            this.synopsis = synopsis;
        }


}
