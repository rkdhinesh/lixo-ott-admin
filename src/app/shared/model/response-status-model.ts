export class Status {
    statusCode: string;
    statusDescription: string;
    transactionId: string;
    id: string;
    constructor(statusCode: string, statusDescription: string,
        transactionId: string) {
        this.statusCode = statusCode;
        this.statusDescription = statusDescription;
        this.transactionId = transactionId;
    }
}
