export class UserResponse {
    status: any;
    statusCode: string;
    statusDescription: string;
    transactionId: string;
    constructor(
        statusCode: string,
        statusDescription: string,
        transactionId: string
    ) {
        this.statusCode = statusCode;
        this.statusDescription = statusDescription;
        this.transactionId = transactionId;

    }
}
