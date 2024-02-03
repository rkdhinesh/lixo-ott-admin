import { Header } from '../../shared/services/header';

export class ScreenPublishedEntities {
    approved: 0;
    approvedBy: string;
    companyId: 0;
    screenId: 0;
    screenPublishedId: 0;
    showsPublished: Array<ShowsPublished>;
    venueId: 0;
  header: Header;
  
  constructor(
    approved: 0,
    approvedBy: string,
    companyId: 0,
    screenId: 0,
    screenPublishedId: 0,
    showsPublished:Array<ShowsPublished>,
    venueId: 0
    ) {
    this.approved = approved;
    this.approvedBy = approvedBy;
    this.companyId = companyId;
    this.screenId = screenId;
    this.screenPublishedId =  screenPublishedId;
    this.showsPublished = showsPublished;
    this.venueId = venueId;
  }


}
export class ShowsPublished{
  bookingOpeningDate: string;
  classesPublished:Array<classesPublished>;
  movieId:0;
  showCanceled:0;
  showDate:string;
  showPublishedId:0;
  showTime:0;

  constructor(
    bookingOpeningDate: string,
  classesPublished:Array<classesPublished>,
  movieId:0,
  showCanceled:0,
  showDate:string,
  showPublishedId:0,
  showTime:0
  ){
    this.bookingOpeningDate = bookingOpeningDate;
    this.classesPublished = classesPublished;
    this.movieId=movieId;
    this.showCanceled=showCanceled;
    this.showDate=showDate;
    this.showPublishedId=showPublishedId;
    this.showTime=showTime;
  }
  
}

class classesPublished{
  baseFare: 0;
  classId: 0;
  classPublishedId: 0;
  discount: 0;
  extraFare: 0;
  fareId: 0;
  seatLayoutPublished:Array<seatLayoutPublished>
constructor(
  baseFare: 0,
  classId: 0,
  classPublishedId: 0,
  discount: 0,
  extraFare: 0,
  fareId: 0,
  seatLayoutPublished:Array<seatLayoutPublished>
){
  this.baseFare=baseFare;
  this.classId=classId;
  this.classPublishedId=classPublishedId;
  this.discount=discount;
  this.extraFare=extraFare;
  this.fareId=fareId;
  this.seatLayoutPublished=seatLayoutPublished;
}
}

class seatLayoutPublished{
  bookingStatus: string;
  coOrdinateX: 0;
  coOrdinateY: 0;
  seat: 0;
  seatId: 0;
  seatNumber: string;
  seatPublishedId: string;
constructor(
  bookingStatus: string,
  coOrdinateX: 0,
  coOrdinateY: 0,
  seat: 0,
  seatId: 0,
  seatNumber: string,
  seatPublishedId: string
){
this.bookingStatus=bookingStatus;
this.coOrdinateX=coOrdinateX;
this.coOrdinateY=coOrdinateY;
this.seat=seat;
this.seatId=seatId;
this.seatNumber=seatNumber;
this.seatPublishedId=seatPublishedId;
}
}

