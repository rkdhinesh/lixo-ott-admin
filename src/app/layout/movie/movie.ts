import { Header } from "../../shared/services/header";
import { Genre } from "../genre/genre";

export class Movie {
  find(arg0: (movie: any) => boolean) {
      throw new Error('Method not implemented.');
  }
  movieId: string;
  movieType: string;
  synopsis: string;
  language: string;
  status: string;
  active: 1;
  censorCertificate: string;
  dimension: string;
  duration: string;
  durations: string[];
  movieName: string;
  rating: string;
  thumbnailUrl: string;
  availableFrom: string;
  availableTo: string;
  previewUrl: string;
  genre: any[] = [];
  header: Header;
  genres: Array<Genre>;
  groupId: number;
  upcomingMovie: any;
  editable: boolean;
  movieShowTermsFileId: number;
  movieShowTermsFlag: string;
  quality: string;
  genreId: number;
  fareId: string;
  yearReleased: string;
  movieUrl: string;
  addedBy: string;
  addedOn: string;
  censorRating: string;
  securityToken: string;
  constructor(
    movieId: string,
    // movieType: string,
    // synopsis: string,
    // language: string,
    // status: string,
    // active: 1,
    // censorCertificate: string,
    // dimension: string,
    movieName: string,
    quality: string,
    genreId: number,
    fareId: string,
    yearReleased: string,
    duration: string,
    availableFrom: string,
    availableTo: string,
    upcomingMovie: number,
    rating: string,
    thumbnailUrl: string,
    previewUrl: string,
    // genre: Array<any>,
    
    // groupId: number,
    // movieShowTermsFileId: number,
    // movieShowTermsFlag: string,
   
    
  
  
  movieUrl: string,
  addedBy: string,
  addedOn: string,
  censorRating: string,
  securityToken: string
  ) {
    this.movieId = movieId;
    // this.movieType = movieType;
    // this.synopsis = synopsis;
    // this.language = language;
    // this.status = status;
    // this.active = active;
    // this.censorCertificate = censorCertificate;
    // this.dimension = dimension;
    this.duration = duration;
    this.movieName = movieName;
    this.rating = rating;
    this.thumbnailUrl = thumbnailUrl;
    this.availableFrom = availableFrom;
    this.availableTo = availableTo;
    this.previewUrl = previewUrl;
    // this.genres = genre;
    this.upcomingMovie = upcomingMovie;
    // this.groupId = groupId;
    // this.movieShowTermsFileId = movieShowTermsFileId;
    // this.movieShowTermsFlag = movieShowTermsFlag;
    this.quality = quality;
    this.genreId = genreId;
    this.fareId = fareId;
    this.yearReleased = yearReleased;
    this.movieUrl = movieUrl;
    this.addedBy = addedBy;
    this.addedOn = addedOn;
    this.censorRating = censorRating;
    this.securityToken = securityToken;
  }
}
