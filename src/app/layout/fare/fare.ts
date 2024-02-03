import { Charge } from "../charge/charge";
import { Tax } from "../charge/tax";
import { Header } from "../../shared/services/header";
import { UUID } from "../../shared/services/uuid";

export class Fare {
  baseFare: number;
  discountFare: number;
  extraFare: number;
  fareDescription: string;
  fareName: string;
  fareId: string;
  header = new Header(UUID.UUID());
  editable: boolean;
  charges: Charge[] = [];
  fareAmount: number;
  amount: string;
  charge: Charge[] = [];
  taxes: Tax[] = [];
  tax: string;
  totalAmount: number;
  taxAdded: string;
  taxIds: number[];

  chargeMappingId: string;

  constructor(
    fareId: string,
    amount: string,
    // baseFare: number,
    // discountFare: number,
    // extraFare: number,
    // fareDescription: string,
    // fareName: string,
    tax: string,
    totalAmount: number,
    taxIds: number[]
    // charge: any[] = []
  ) {
    this.fareId = fareId;
    this.amount = amount;
    this.totalAmount = totalAmount;
    // this.baseFare = baseFare;
    // this.discountFare = discountFare;
    // this.extraFare = extraFare;
    // this.fareName = fareName;
    // this.fareDescription = fareDescription;
    this.tax = tax;
    this.taxIds = taxIds;
    // this.charges = charge;
  }
}
