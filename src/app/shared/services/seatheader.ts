export class SeatHeader {

    callingAPI: string;
    channel: string;
    transactionId: string;

    constructor() {

        this.callingAPI = 'moviepanda-web-ui';
        this.channel = 'web';
        this.transactionId = new Date().getTime().toString();
    }
}