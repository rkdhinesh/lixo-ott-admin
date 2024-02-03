import { Pipe, PipeTransform } from '@angular/core';
import { AddMovieComponent } from './add-movie.component';
import { LogService } from '../../../shared/services/log.service';

@Pipe({
    name: 'FilterPipe',
})
export class AddMovieFilterPipe implements PipeTransform {

    constructor(public cdcVal: AddMovieComponent, private log: LogService) {

    }

    transform(value: any, input: any, totalVal: any) {
        this.log.info("querysting:::::" + totalVal);
        if (input) {
            return value.filter(function (el: any) {
                this.log.info(el);
                this.log.info(el.zoneName);
                if (el.name != null) {
                    return el.name.toLowerCase().indexOf(input.toLowerCase()) > -1
                }
                else if (el.genreName) {
                    return el.genreName.toLowerCase().indexOf(input) > -1;
                }
            })
            // this.cdcVal.filterPagenation(value);            
        }
        return value;
    }
}