export class Header {

    callingAPI: string;
    channel: string;
    transactionId: string;

    constructor(transactionId: string) {

        this.callingAPI = 'web';
        this.channel = 'admin-web-ui';
        this.transactionId = transactionId;
    }
}
