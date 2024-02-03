export class AddUserHeader {

    callingAPI: string;
    channel: string;
    transactionId: string;

    constructor(transactionId: string) {

        this.callingAPI = 'admin-web-ui';
        this.channel = 'admin-web-ui';
        this.transactionId = transactionId;
    }
}