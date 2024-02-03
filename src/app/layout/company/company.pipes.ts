import { Pipe, PipeTransform } from '@angular/core';
import { CompanyPageComponent } from './company-page.component';
import { LogService } from '../../shared/services/log.service';

@Pipe({
    name: 'CompanyFilterPipe',
})
export class CompanyFilterPipe implements PipeTransform {

    constructor(public cdcVal: CompanyPageComponent, private log: LogService) {

    }

    transform(value: any, input: string, totalVal: any) {
        this.log.info("querysting:::::" + totalVal);
        if (input) {
            input = input.toLowerCase();
            return totalVal.filter(function (el: any) {
                return el.companyName.toLowerCase().indexOf(input) > -1;
            })
        }
        return value;
    }
}