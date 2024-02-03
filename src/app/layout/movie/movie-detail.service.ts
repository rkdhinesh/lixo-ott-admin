import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { MovieDetail } from './movie-detail';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class MovieDetailService {

  constructor(private router: Router) { }

  movieDetail = new Subject<MovieDetail>();
  movieDetail$ = this.movieDetail.asObservable();
  getMovieDetail: MovieDetail;
  existMovieNames: string[] = [];
  index: number = 0;
  navigateUrl: string = '';

  toViewMovieDetail(data: MovieDetail) {
    console.log(data);
    this.movieDetail.next(data);
    this.getMovieDetail = data;
    // this.router.navigate(['/view-movie-detail'])
  }

  getSelectedMovieDetail() {
    console.log(this.getMovieDetail);
    return this.getMovieDetail;
  }

  receiveAllMovieDetails(movieDetails: any) {
    console.log(movieDetails[0])
    movieDetails.forEach((movieDetail) => {
      this.existMovieNames.push(movieDetail.movieName);
    })
  }

  getAllMovieName() {
    return this.existMovieNames;
  }

  receiveCurrentUrl(url: string) {
    this.navigateUrl = url;
  }

  getPreviousUrl() {
    return this.navigateUrl;
  }
}
