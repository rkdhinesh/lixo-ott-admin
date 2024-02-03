import { Injectable }     from '@angular/core';

@Injectable()
export class GolbalProcedure {
    constructor() { }
    parseBinaryToBoolean(response:number) {
        let result: Boolean;
        result = !!+response;
        return result;
    }
    parseBooleanToBinary(response:Boolean) {
        let    result        : number;
        result = response ? 1: 0;
        return result;
    }
}
