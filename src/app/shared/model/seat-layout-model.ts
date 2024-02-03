export class SeatLayoutModel {
    coOrdinateX:number;
    coOrdinateY:number;
    seat:boolean;
    seatId:string;
    seatNumber:string;
    rowReference:string;
    rowLabel:string;
    columnReference:number;
    tempSeatNumber:string;
    inputDisabled:boolean = false;
    checkBoxDisabled:boolean = false;
    seatBroken:boolean = false;
    selectedstatus_ui : number = 0;
    bookingStatus : string = 'AVAILABLE';
    constructor(){

    }
}
