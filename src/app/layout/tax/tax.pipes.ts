import { Pipe, PipeTransform } from '@angular/core';
import { TaxComponent } from './tax.component';
import { LogService } from '../../shared/services/log.service';

@Pipe({
    name: 'FilterPipe',
})
export class FilterPipe implements PipeTransform {

    constructor(public cdcVal: TaxComponent, private log: LogService) {

    }

    transform(value: any, input: string, totalVal: any) {

        this.log.info("querysting:::::" + totalVal);
        if (input) {
            input = input.toLowerCase();
            return totalVal.filter(function (el: any) {
                this.log.info(el.taxId);
                this.log.info(el.taxName);
                this.log.info(el.taxDescription);
                this.log.info(el.taxPercentage);

                return el.taxName.toLowerCase().indexOf(input) > -1;
            })
            // this.cdcVal.filterPagenation(value);            
        }
        return value;
    }
}