import { Pipe, PipeTransform } from '@angular/core';
import { VenueComponent } from './venue.component';
import { LogService } from '../../shared/services/log.service';

@Pipe({
    name: 'VenueFilterPipe',
})
export class VenueFilterPipe implements PipeTransform {

    constructor(public cdcVal: VenueComponent, private log: LogService) {

    }

    transform(value: any, input: string, totalVal: any) {
        this.log.info("querysting:::::" + totalVal);
        if (input) {
            input = input.toLowerCase();
            return totalVal.filter(function (el: any) {
                return el.venueName.toLowerCase().indexOf(input) > -1;
            })
        }
        return value;
    }
}