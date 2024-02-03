import { PublishDropDownModel } from "./add-publish/add-publish.component";

export class PublishModel {
  showDate: any;
  showTime: string;
  approvalStatus: boolean = false;
  selectedMovie: PublishDropDownModel;
  movieList: PublishDropDownModel[] = [];
  cancelShow: boolean = false;
  boxofficeonly:boolean = false;
  approve: boolean = false;
  classId: number;
  className: string;
  baseFare: number;
  extraFare: number;
  discount: number;
  fareId: number;
  tax: string;
  totalFareIncludingTax: string;
  showPublishedId: number;
  classPublishedId: number;
  screenPublishedId: number;
  fareTax: number;
  charge: number;
  chargeTax: number;
  totalTax: number;
  totalAmount: number;
  constructor() { }
}
