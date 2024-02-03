import { Pipe, PipeTransform } from '@angular/core';
import { AddLocalityComponent } from './add-locality.component';
import { LogService } from '../../../shared/services/log.service';

@Pipe({
    name: 'FilterPipe',
})
export class FilterPipe implements PipeTransform {

    constructor(public cdcVal: AddLocalityComponent, private log: LogService) { }

    transform(value: any, input: any, totalVal: any) {
        this.log.info("querysting:::::" + totalVal);
        if (input) {
            return value.filter(function (el: any) {
                this.log.info(el);
                this.log.info(el.zoneName);
                if (el.name != null) {
                    return el.name.toLowerCase().indexOf(input.toLowerCase()) > -1
                }
                else if (el.zoneName) {
                    let inputt = JSON.stringify(input)
                    return el.zoneName.toLowerCase().indexOf(inputt.toLowerCase) > -1;
                }
            })
            // this.cdcVal.filterPagenation(value);            
        }
        return value;
    }
}