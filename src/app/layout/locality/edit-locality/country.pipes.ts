import { Pipe, PipeTransform } from '@angular/core';
import { EditLocalityComponent } from './edit-locality.component';
import { LogService } from '../../../shared/services/log.service';

@Pipe({
    name: 'FilterPipe',
})
export class FilterPipe implements PipeTransform {

    constructor(public cdcVal: EditLocalityComponent, private log: LogService) { }

    transform(value: any, input: string, totalVal: any) {
        this.log.info("querysting:::::" + totalVal);
        if (input) {
            return value.filter(function (el: any) {
                this.log.info(el);
                this.log.info(el.zoneName);
                if (el.name != null) {
                    return el.name.toLowerCase().indexOf(input.toLowerCase()) > -1
                }
                else if (el.zoneName) {
                    return el.zoneName.indexOf(input) > -1;
                }
            })
            // this.cdcVal.filterPagenation(value);            
        }
        return value;
    }
}