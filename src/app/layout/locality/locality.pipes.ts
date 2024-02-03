import { Pipe, PipeTransform } from '@angular/core';
import { LocalityComponent } from './locality.component';
import { LogService } from '../../shared/services/log.service';

@Pipe({
    name: 'FilterPipe',
})
export class FilterPipe implements PipeTransform {

    constructor(public cdcVal: LocalityComponent, private log: LogService) {

    }

    transform(value: any, input: string, totalVal: any) {
        this.log.info("querysting:::::" + totalVal);
        if (input) {
            input = input.toLowerCase();
            return totalVal.filter(function (el: any) {
                this.log.info(el);
                this.log.info(el.type);

                return el.city.toLowerCase().indexOf(input) > -1 || el.localityName.toLowerCase().indexOf(input) > -1;
            })
            // this.cdcVal.filterPagenation(value);            
        }
        return value;
    }
}