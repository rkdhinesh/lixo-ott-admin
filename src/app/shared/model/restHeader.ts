
export class RestHeader {
    callingAPI: string;
    channel:string;
    transactionId:string;
  constructor(
    callingAPI: string,
    channel:string,
    transactionId: string){
          this.callingAPI = callingAPI;
          this.channel = channel;
          this.transactionId = transactionId;  
        }
  }