export class MovieDetail {

    movieId: string;
    movieName: string;
    language: string;
    subtitles: string;
    directors: string;
    producers: string;
    studio: string;
    starCast: string;
    securityToken: string;
    synopsis: string;
    constructor(movieId: string, movieName: string, language: string, 
        subtitles: string, directors: string, producers: string, studio: string, starCast: string,
        synopsis: string) {
            this.movieId = movieId;
            this.movieName = movieName;
            this.language = language;
            this.subtitles = subtitles;
            this.directors = directors;
            this.producers = producers;
            this.studio = studio;
            this.starCast = starCast;
            // this.securityToken = securityToken;
            this.synopsis = synopsis
        }
}