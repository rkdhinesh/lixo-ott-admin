import { Pipe, PipeTransform } from '@angular/core';
import { FareComponent } from './fare.component';
import { LogService } from '../../shared/services/log.service';

@Pipe({
    name: 'FilterPipe',
})
export class FilterPipe implements PipeTransform {

    constructor(public cdcVal: FareComponent, private log: LogService) {

    }

    transform(value: any, input: string, totalVal: any) {

        this.log.info("querysting:::::" + totalVal);
        if (input) {
            input = input.toLowerCase();
            return totalVal.filter(function (el: any) {
                this.log.info(el.baseFare);
                this.log.info(el.charge);
                this.log.info(el.discountFare);
                this.log.info(el.extraFare);
                this.log.info(el.fareDescription);
                this.log.info(el.fareName);
                return el.fareName.toLowerCase().indexOf(input) > -1;
            })
            // this.cdcVal.filterPagenation(value);            
        }
        return value;
    }
}