import { Header } from '../../shared/services/header';
import { CineastDetails } from './add-movie-mapping/cineast-add-movie-mapping';

export class DisplayMovie {
    movieId: number;
    movieName: string;
    movieCineastId: number;
    mapIds: Array<CineastDetails> = [];
    mapp: any[] = [];
    // CineastDetail: Array<CineastDetails>;

    header: Header;
    constructor(
        movieId: number,
        movieName: string,
        movieCineastId: number,
        mapp: Array<any>
        // CineastDetails: Array<any>,

    ) {
        this.movieId = movieId;
        this.movieName = movieName;
        this.movieCineastId = movieCineastId;
        this.mapIds = mapp;
        // this.CineastDetail = CineastDetails;


    }
}




