import { Component, OnInit } from "@angular/core";
import { MovieDetail } from "../movie-detail";
import { RestService } from "../../../api.service";
import { environment } from "../../../../environments/environment";
import { LogService } from "../../../shared/services/log.service";
import { TaxResponse } from "../../tax/taxResponse";
import { UUID } from "../../../shared/services/uuid";
import { Header } from "../../../shared/services/header";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Movie } from "../movie";
import { element } from "protractor";
import { MovieDetailService } from "../movie-detail.service";


@Component({
  selector: "app-add-movie-detail",
  templateUrl: "./add-movie-detail.component.html",
  styleUrls: ["./add-movie-detail.component.scss"]
})
export class AddMovieDetailComponent implements OnInit {
  
  //property declaration
  unAddedMovieNames: string[] = [];
  existAllMovies: Movie[];
  createMovieDetailForm: FormGroup;
  existAllMovieNamesWithDetails: string[] = [];

  //dependency injection
  constructor(
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private movieDetailService: MovieDetailService) { }

  ngOnInit() {
    this.existAllMovieNamesWithDetails = this.movieDetailService.getAllMovieName(); // get all already exist movie names from movies with movie Details
    this.loadAllMovie();      //call loadAllMovie() method to get already existing movies
    //Create a FormGroup for Movie Detail form in HTML
    this.createMovieDetailForm = this.formBuilder.group({
      // Create formControl with initial value and apply validation
      movieId: [''],
      movieName: ['', Validators.required],
      language: ['', [Validators.required, Validators.pattern(/^([a-zA-Z]+(?:, [a-zA-Z]+)*)?$/)]],
      subtitles: ['', [Validators.required, Validators.pattern(/^([a-zA-Z]+(?:, [a-zA-Z]+)*)?$/)]],
      directors: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s'!@#$%^&*(),.?":{}|<>]+$/)]],
      producers: ['', Validators.required],
      studio: ['', Validators.required],
      starCast: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s'!@#$%^&*(),.?":{}|<>]+$/)]],
      synopsis: ['Not Available', Validators.required],
    })
  }

  // On selected dropdown value
  onMovieSelected(selectedOption: any) {
    //get selected dropdown value
    const selectedValue = selectedOption.option.value;
    //get movie Id for selected dropdown value using find() method
    const selectedMovieId = (this.existAllMovies.find((movie) => movie.movieName === selectedValue)).movieId
    //set movieId field value in the form
    this.createMovieDetailForm.get('movieId').patchValue(selectedMovieId);
    //set movieName field value in the form
    this.createMovieDetailForm.get('movieName').patchValue(selectedValue);

  }

  loadAllMovie() {
    // Get already exist movies from api end-point
    this.restService.get(environment.getAllMoviesPath).subscribe(
      (response: any) => {            // get data or response from the end-point called
        this.existAllMovies = response.data
        //checks if movie with movie details entry already exist
        if (this.existAllMovieNamesWithDetails && this.existAllMovieNamesWithDetails.length > 0) {
          //filter only movie names for which movie detail not exist
          this.unAddedMovieNames.push(this.existAllMovies.find((movie) => !this.existAllMovieNamesWithDetails.includes(movie.movieName)).movieName)
        }
      }
    )
  }

  submitForm() {
    const requestBody = JSON.stringify(this.createMovieDetailForm.value);      // movie detail form data from HTML
    this.restService.post(JSON.parse(requestBody), environment.addMovieDetailPath)
      .map((response: any) => {     // get response from the end-point called about post data
        let result = { statusCode: response.statusCode, statusDescription: response.statusDescription }
        return result;
      })
      .subscribe(result => {
        if (result.statusCode == 201) {    // post created successful
          this.openSnackBar(result.statusDescription, 'success-movie-detail-snackbar', '/movie-detail');      // show successful post msg
        } else if (result.statusCode == 202) {     // already exist
          this.openSnackBar(result.statusDescription, 'already-exist-snackbar');     // show already exist msg
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  openSnackBar(message: string, style: string, url?: string) {     // msg panel
    this.snackBar.open(message, '', {
      duration: 2000,           // show msg for 2 sec.
      panelClass: style
    });
    if (url) {
      setTimeout(() => {
        this.router.navigate([url])
      }, 2000)           // route after 2 sec msg
    }
  }

}
