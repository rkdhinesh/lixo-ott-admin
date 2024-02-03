import { Pipe, PipeTransform } from '@angular/core';
import { ModuleOperationsComponent } from './module-operations.component';
import { LogService } from '../../../shared/services/log.service';

@Pipe({
    name: 'ModuleOperationsFilterPipe',
})
export class ModuleOperationsFilterPipe implements PipeTransform {

    constructor(public cdcVal: ModuleOperationsComponent, private log: LogService) {

    }

    transform(value: any, input: string, totalVal: any) {
        this.log.info("querysting:::::" + totalVal);
        if (input) {
            input = input.toLowerCase();
            return totalVal.filter(function (el: any) {
                return el.moduleName.toLowerCase().indexOf(input) > -1;
            })
        }
        return value;
    }
}