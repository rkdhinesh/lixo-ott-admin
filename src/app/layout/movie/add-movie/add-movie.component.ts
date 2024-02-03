import { Movie } from "../movie";
import { MovieResponse } from "../movieResponse";
import { Headers } from "../../../shared/model/request-header";
import { RestService } from "../../../api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from "@angular/material/chips";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UUID } from "../../../shared/services/uuid";
import { Genre } from "../../genre/genre";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, ViewChild, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { Duration } from "../duration";
import { DatePipe } from "@angular/common";
import { environment } from "../../../../environments/environment";
import { LogService } from "../../../shared/services/log.service";
import { Header } from "../../../shared/services/header";
import { ViewmodalComponent } from "../../../viewmodal/viewmodal.component";
import { Movies } from './movieterms';
import { Fare } from "../../fare/fare";

@Component({
  selector: "app-add-movie",
  templateUrl: "./add-movie.component.html",
  styleUrls: ["./add-movie.component.scss"]
})
export class AddMovieComponent implements OnInit {

  //property declaration
  selectedData: Movie;
  genreList: Array<Genre> = [];
  fareList: Fare[] = [];
  genres: string[] = [];
  createMovieForm: FormGroup;
  movieIdExist: boolean = false;
  movieExist: boolean = false;
  movieDetails: any;
  quality: string[] = ["2K", "4K"];
  @ViewChild("genreInput") genreInput: ElementRef;
  //genre Input
  selectable = true;
  removable = true;
  addOnBlur = false;
  isGenreIdTouched = false;

  //dependency injection
  constructor(
    private restService: RestService,
    private datePipe: DatePipe,
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.getAllGenreDetail();      //call getAllGenreDetail() method to get already existing genres to populate
    this.getAllFareDetail();      //call getAllFareDetail() method to get already existing fares to populate
    //Create a FormGroup for New Movie form in HTML
    this.createMovieForm = this.formBuilder.group({
      // Create formControl with initial value and apply validation
      movieId: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      movieName: ['', Validators.required],
      yearReleased: ['', [Validators.required, Validators.pattern(/^(18[0-9][0-9]|19[0-9][0-9]|20[0-9][0-9]|21[0-9][0-9])$/)]],
      quality: ['', Validators.required],
      duration: ['', [Validators.required, Validators.pattern(/^\d+h \d+m$/)]],
      genreId: ['', Validators.required],
      fareId: ['', Validators.required],
      censorRating: ['', Validators.required],
      securityToken: ['', Validators.required],
      availableFrom: ['', Validators.required],
      availableTo: ['', Validators.required],
      thumbnailUrl: ['', [Validators.required, Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)]],
      previewUrl: ['', [Validators.required, Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)]],
      movieUrl: ['', [Validators.required, Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)]],
      upcomingMovie: [],
      addedBy: ['admin'],
      addedOn: [this.datePipe.transform(new Date(), "yyyy-MM-dd")],
      rating: [0],
    })
    console.log(this.createMovieForm.get('genreId').value === null)
    this.getAllMovie();     //call getAllMovie() method to get already existing movies
  }

  //Quality dropdown select event trigger
  onQualitySelected(selectedOption: any) {
    const selectedValue = selectedOption.option.value;
    this.createMovieForm.get('quality').patchValue(selectedValue); //set selected value in the createMovieForm
  }

  //Fare dropdown select event trigger
  onFareSelected(selectedFare: any) {
    const selectedValue = selectedFare.option.value;
    this.createMovieForm.get('fareId').patchValue(selectedValue); //set selected value in the createMovieForm
  }

  //genre required error show on focus out
  onGenreIdBlur() {
    this.isGenreIdTouched = true;
  }

  getAllMovie() {
    // Get already exist movies from api end-point
    this.restService.get(environment.getAllMoviesPath)
      .map((response: any) => {            // get data or response from the end-point called
        let movies: Array<Movie> = [];
        if (response.statusCode == 201) {   // Successful get
          response.data.forEach(movie => {
            let obj = new Movie(movie.movieId, movie.movieName, movie.quality, movie.genreId,
              movie.fareId, movie.yearReleased, movie.duration, movie.availableFrom, movie.availableTo,
              movie.upcomingMovie, movie.rating, movie.thumbnailUrl, movie.previewUrl,
              movie.movieUrl, movie.addedBy, movie.addedOn, movie.censorRating, movie.securityToken);
            movies.push(obj);
          });
        }
        else if (response.statusCode == 204) {  // no Content
        }
        return movies;
      }).subscribe(movies => {
        this.movieDetails = movies;
      })
  }

  //Movie Id input control out focus event trigger
  movieIdFocusOut(event: any) {
    this.movieIdExist = false;
    //checking typed Movie Id with already exist ones
    this.movieDetails.forEach(movie => {
      if (movie.movieId === event.target.value) {
        this.movieIdExist = true;
      }
    })
  }

  //Movie Name input control out focus event trigger
  movieNameFocusOut(event: any) {
    this.movieExist = false;
    //checking typed Movie Name with already exist ones
    this.movieDetails.forEach(movie => {
      if (movie.movieName === event.target.value) {
        this.movieExist = true;
      }
    })
  }

  getAllFareDetail() {
    // Get already exist fare details from api end-point
    this.restService.get(environment.getAllFarePath)
      .map((response: any) => {            // get data or response from the end-point called
        let result = { statusCode: response.statusCode, statusDescription: response.statusDescription, data: response.data }
        return result;
      })
      .subscribe(
        result => {
          if(result.statusCode == 201) {
            result.data.forEach(erg => {
                  this.fareList.push(
                    new Fare(erg.fareId, erg.amount, erg.tax, erg.totalAmount, erg.taxIds)
                  );
                });
          } else if ((result.statusCode == 204)) {

          }
        }
    );
  }

  saveDetail() {
    const requestBody = JSON.stringify(this.createMovieForm.value)      // new movie form data from HTML
    this.restService.post(JSON.parse(requestBody), environment.addMoviePath)
      .map((response: any) => {     // get response from the end-point called about post data
        let result = { statusCode: response.statusCode, statusDescription: response.statusDescription }
        return result;
      })
      .subscribe(
        result => {
          if ((result.statusCode == 201)) {    // post created successful
            this.openSnackBar(result.statusDescription, 'success-movie-snackbar', '/add-movie-detail');      // show successful post msg
          } else if ((result.statusCode == 202)) {     // already exist
            this.openSnackBar(result.statusDescription, 'already-exist-snackbar');     // show already exist msg
          }
        },
        err => {
          var errorVal = err.status.statusDescription;
          this.openSnackBar("ERROR MSG", errorVal);
        }
      );
  }

  //Upcoming Movie Checkbox event trigger
  upcomingFlagChange(upcomingFlag: boolean) {
    this.createMovieForm.get('upcomingMovie').patchValue(upcomingFlag)  // set true or false
  }

  openSnackBar(message: string, style: string, url?: string) {     // msg panel
    this.snackBar.open(message, '', {
      duration: 2000,           // show msg for 2 sec.
      panelClass: style
    });
    if (url) {
      setTimeout(() => {
        this.router.navigate([url]);
      }, 2000)           // route after 2 sec msg
    }
  }

  private getAllGenreDetail(): any {
    // Get already exist genre details from api end-point
    this.restService.get(environment.getAllGenrePath)
      .map((response: any) => {            // get data or response from the end-point called
        let result = { statusCode: response.statusCode, statusDescription: response.statusDescription, data: response.data }
        return result;
      })
      .subscribe(
        result => {
          if ((result.statusCode == 201)) {
            result.data.forEach(erg => {
              this.genreList.push(
                new Genre(erg.genreId, erg.genreName, erg.description)
              );
            });
          } else if ((result.statusCode == 204)) {

          }
        }

      );
  }

  displayFn(genres?: Genre): string | undefined {
    return genres ? genres.genreName : undefined;
  }

  /******************* Mat chips coding Start *********************/
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || "").trim()) {
      this.genres.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = "";
    }
  }
  remove(fruit: string): void {
    const index = this.genres.indexOf(fruit);
    if (index >= 0) {
      this.createMovieForm.get('genreId').patchValue(null);
      this.genres.splice(index, 1);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    this.genres.push(event.option.viewValue);
    this.createMovieForm.get('genreId').patchValue(event.option.value.genreId);
    this.genreInput.nativeElement.value = "";
  }
  /******************* Mat chips coding End *********************/
}
