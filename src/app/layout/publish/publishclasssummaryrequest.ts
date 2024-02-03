import { Dataobject } from "./dataobject";

export class PublishClassSummaryRequest {
    baseFare: number;
    classId: number;
    extraFare: number;
    fareId: number;
    className:string;
    selectClassName:Dataobject
    constructor( classId: number,baseFare: number, extraFare: number, fareId: number, className:string) {
            this.classId = classId;
            this.baseFare = baseFare;
            this.extraFare = extraFare;
            this.fareId = fareId;
            this.className = className;
    }
}