import { Dataobject } from "./dataobject";

export class PublishShowSummaryRequest {
    movieId: number;
    showTime: string;
    selectedMovieData:Dataobject;
    // control: FormControl = new FormControl();
    constructor(movieId: number, showTime: string) {
            this.movieId = movieId;
            this.showTime = showTime;
            // this.control = new FormControl();
    }
}
