import { Pipe, PipeTransform } from '@angular/core';
import { ScreenComponent } from './screen.component';
import { LogService } from '../../shared/services/log.service';

@Pipe({
    name: 'ScreenFilterPipe',
})
export class ScreenFilterPipe implements PipeTransform {

    constructor(public cdcVal: ScreenComponent, private log: LogService) {

    }

    transform(value: any, input: string, totalVal: any) {
        this.log.info("querysting:::::" + totalVal);
        if (input) {
            input = input.toLowerCase();
            return totalVal.filter(function (el: any) {
                return el.screenName.toLowerCase().indexOf(input) > -1;
            })
        }
        return value;
    }
}