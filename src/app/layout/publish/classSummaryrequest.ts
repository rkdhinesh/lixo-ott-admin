export class PublishClassSummaryRequest {
    baseFare: number;
    classId: number;
    extraFare: number;
    fareId: number;
    constructor(baseFare: number, classId: number, extraFare: number, fareId: number) {
            this.baseFare = baseFare;
            this.classId = classId;
            this.extraFare = extraFare;
            this.fareId = fareId;
    }
}