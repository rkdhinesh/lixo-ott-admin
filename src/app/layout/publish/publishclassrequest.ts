import { Dataobject } from "./dataobject";

export class PublishClassRequest {
    baseFare: number;
    classId: number;
    discount: number;
    extraFare: number;
    fareId: number;
    className:string;
    selectClassName:Dataobject
    constructor(
            classId: number,
            baseFare: number,
            extraFare: number,
            discount: number,
            fareId: number,
            className:string) {
            this.classId = classId;
            this.baseFare = baseFare;
            this.extraFare = extraFare;
            this.discount = discount;
            this.fareId = fareId;
            this.className = className;

    }
}