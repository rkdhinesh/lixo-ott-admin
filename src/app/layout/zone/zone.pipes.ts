import { Pipe, PipeTransform } from '@angular/core';
import { ZoneComponent } from './zone.component';
import { LogService } from '../../shared/services/log.service';

@Pipe({
    name: 'FilterPipe',
})
export class FilterPipe implements PipeTransform {

    constructor(public cdcVal: ZoneComponent, private log: LogService) {

    }

    transform(value: any, input: string, totalVal: any) {

        this.log.info("querysting:::::" + totalVal);
        if (input) {
            input = input.toLowerCase();
            return totalVal.filter(function (el: any) {
                this.log.info(el.zoneId);
                this.log.info(el.zoneName);

                return el.zoneName.toLowerCase().indexOf(input) > -1;
            })
            // this.cdcVal.filterPagenation(value);            
        }
        return value;
    }
}