import { Header } from '../../shared/services/header';

export class Tax {
  taxId: string;
  taxName: string;
  taxDescription: string;
  taxPercentage: 0;
  header: Header;
  editable: boolean;


  constructor(
    taxId: string,
    taxName: string,
    taxDescription: string,
    taxPercentage: 0
  ) {
    this.taxId = taxId;
    this.taxName = taxName;
    this.taxDescription = taxDescription;
    this.taxPercentage = taxPercentage;
  }


}