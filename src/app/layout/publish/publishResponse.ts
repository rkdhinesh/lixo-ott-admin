export class PublishResponse {
  showsPublished:Array<any>;
    status: any;
  
      statusCode: string;
      statusDescription:string;
      transactionId:string;
   
    
   // constructor(status: any,){this.status = status;}
  
   constructor(
    statusCode: string,
    statusDescription:string,
    transactionId:string
      ){
          this.statusCode = statusCode;
          this.statusDescription = statusDescription;
          this.transactionId = transactionId;
          
  }
  
    
    }