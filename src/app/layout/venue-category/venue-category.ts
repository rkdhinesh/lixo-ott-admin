import { Header } from '../../shared/services/header';

export class VenueCategory {
      synopsis: string;
      venueCategoryId: number;
      venueCategoryName: string;
      header:Header;
      editable:boolean;

      constructor(
            synopsis: string,
            venueCategoryId:number,
            venueCategoryName: string){
                  this.synopsis =synopsis;
                  this.venueCategoryId = venueCategoryId;
                  this.venueCategoryName = venueCategoryName;
            }
}
