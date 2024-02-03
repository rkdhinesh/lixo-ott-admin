import { Pipe, PipeTransform } from '@angular/core';
import { ChargeComponent } from './charge.component';
import { LogService } from '../../shared/services/log.service';

@Pipe({
    name: 'FilterPipe',
})
export class FilterPipe implements PipeTransform {

    constructor(public cdcVal: ChargeComponent, private log: LogService) {

    }

    transform(value: any, input: string, totalVal: any) {

        this.log.info("querysting:::::" + totalVal);
        if (input) {
            input = input.toLowerCase();
            return totalVal.filter(function (el: any) {
                this.log.info(el.chargeId);
                this.log.info(el.chargeName);
                this.log.info(el.chargeDescription);
                this.log.info(el.chargeAmount);
                this.log.info(el.chargeMappingId);
                this.log.info(el.gatewayPercentage);
                this.log.info(el.vendorPercentage);

                return el.chargeName.toLowerCase().indexOf(input) > -1;
            })
            // this.cdcVal.filterPagenation(value);            
        }
        return value;
    }
}