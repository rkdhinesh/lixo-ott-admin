import { PublishClassRequest } from "./publishclassrequest";
import { Dataobject } from "./dataobject";

export class PublishShowRequest {
    bookingOpeningDate: string;
    classesPublished: Array<PublishClassRequest>;
    movieId: number;
    showCanceled: number;
    showDate: any;
    showTime: string;
    selectMovie:Dataobject;

    constructor(showDate: any,
            bookingOpeningDate: string,
            showTime: string,
            movieId: number,
            showCanceled: number,
            classesPublished: Array<PublishClassRequest>,
            selectMovie:Dataobject


           ) 
           {
            this.showDate = showDate;
            this.bookingOpeningDate = bookingOpeningDate;
            this.showTime = showTime;
            this.movieId = movieId;
            this.showCanceled = showCanceled;
            this.classesPublished = classesPublished;
            this.selectMovie=selectMovie;
    }
}