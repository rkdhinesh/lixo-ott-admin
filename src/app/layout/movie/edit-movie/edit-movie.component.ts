import { Movie } from "../movie";
import { MovieResponse } from "../movieResponse";
import { Headers } from "../../../shared/model/request-header";
import { RestService } from "../../../api.service";
import { ActivatedRoute, Router } from "@angular/router";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { UUID } from "../../../shared/services/uuid";
import { Genre } from "../../genre/genre";
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { Component, ElementRef, ViewChild, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { TempDataService } from "../../../shared/temp-dataStore";
import { Duration } from "../duration";
import { DatePipe } from "@angular/common";
import { Movies } from '../add-movie/movieterms';
import { environment } from "../../../../environments/environment";
import { LogService } from "../../../shared/services/log.service";
import { Header } from "../../../shared/services/header";
import { ViewmodalComponent } from "../../../viewmodal/viewmodal.component";
import { Fare } from "../../fare/fare";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-edit-movie",
  templateUrl: "./edit-movie.component.html",
  styleUrls: ["./edit-movie.component.scss"]
})
export class EditMovieComponent implements OnInit {

  //property declaration
  selectedData: any;
  genreList: Array<Genre> = [];
  existingGenres: any[] = [];
  genres: any[] = [];
  fareList: Fare[] = [];
  @ViewChild("genreInput") genreInput: ElementRef;
  editMovieForm: FormGroup;
  quality: string[] = ["2K", "4K"];
  //genre Input
  selectable = true;
  removable = true;
  addOnBlur = false;
  isGenreIdTouched = false;

  //dependency injection
  constructor(
    private tempDataService: TempDataService,
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.getAllGenreDetail();      //call getAllGenreDetail() method to get already existing genres to populate
    this.getAllFareDetail();      //call getAllFareDetail() method to get already existing fares to populate
    //get clicked movie data here
    this.tempDataService.currentSelectedData.subscribe(
      selectedData => (this.selectedData = selectedData)
    );
    //Create a FormGroup for New Movie form in HTML
    this.editMovieForm = this.formBuilder.group({
      // Create formControl with received value and apply validation
      movieId: [this.selectedData.movie.movieId, [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      movieName: [this.selectedData.movie.movieName, Validators.required],
      yearReleased: [this.selectedData.movie.yearReleased, [Validators.required, Validators.pattern(/^(18[0-9][0-9]|19[0-9][0-9]|20[0-9][0-9]|21[0-9][0-9])$/)]],
      quality: [this.selectedData.movie.quality, Validators.required],
      duration: [this.selectedData.movie.duration, [Validators.required, Validators.pattern(/^\d+h \d+m$/)]],
      genreId: [this.selectedData.movie.genreId, Validators.required],
      fareId: [this.selectedData.movie.fareId, Validators.required],
      censorRating: [this.selectedData.movie.censorRating, Validators.required],
      securityToken: [this.selectedData.movie.securityToken, Validators.required],
      availableFrom: [this.selectedData.movie.availableFrom, Validators.required],
      availableTo: [this.selectedData.movie.availableTo, Validators.required],
      thumbnailUrl: [this.selectedData.movie.thumbnailUrl, [Validators.required, Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)]],
      previewUrl: [this.selectedData.movie.previewUrl, [Validators.required, Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)]],
      movieUrl: [this.selectedData.movie.movieUrl, [Validators.required, Validators.pattern(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)]],
      upcomingMovie: [this.selectedData.movie.upcomingMovie],
      addedBy: [''],
      addedOn: [this.selectedData.movie.addedOn],
      rating: [0],
    })
  }

  //Quality dropdown select event trigger
  onQualitySelected(selectedOption: any) {
    const selectedValue = selectedOption.option.value;
    this.editMovieForm.get('quality').patchValue(selectedValue); //set selected value in the createMovieForm
  }

  //Fare dropdown select event trigger
  onFareSelected(selectedFare: any) {
    const selectedValue = selectedFare.option.value;
    this.editMovieForm.get('fareId').patchValue(selectedValue); //set selected value in the createMovieForm
  }

  //genre required error show on focus out
  onGenreIdBlur() {
    this.isGenreIdTouched = true;
  }

  //Upcoming Movie Checkbox event trigger
  upcomingFlagChange(upcomingFlag: boolean) {
    this.selectedData.movie.upcomingMovie = upcomingFlag;  // set true or false
  }

  getAllFareDetail() {
    // Get already exist fare details from api end-point
    this.restService.get(environment.getAllFarePath)
      .map((fare: any) => {            // get data or response from the end-point called
        if (fare) {
          fare.data.forEach(erg => {
            this.fareList.push(
              new Fare(erg.fareId, erg.amount, erg.tax, erg.totalAmount, erg.taxIds)
            );
          });
        }
        return this.fareList;
      })
      .subscribe(

    );
  }

  saveDetail() {
    const requestBody = JSON.stringify(this.editMovieForm.value);      // edit movie form data from HTML
    this.restService.put(JSON.parse(requestBody), environment.updateMoviePath + this.selectedData.movie.movieId)
      .map((response: any) => {     // get response or dat from the end-point called about put data
        let result = { statusCode: response.statusCode, statusDescription: response.statusDescription }
        return result;
      })
      .subscribe(
        result => {
          if (result.statusCode == 201) {    // update successful
            this.openSnackBar(result.statusDescription, 'success-movie-snackbar', '/movie');      // show successful update msg
          }
        },
        err => {
          var errorVal = err.status.statusDescription;
          this.openSnackBar("ERROR MSG", errorVal);
        }
      );
  }

  openSnackBar(message: string, style: string, url?: string) {     // msg panel
    this.snackBar.open(message, '', {
      duration: 2000,           // show msg for 2 sec.
      panelClass: style
    });
    if (url) {
      setInterval(() => {
        this.router.navigate([url]);
      }, 2000)           // route after 2 sec msg
    }
  }

  private getAllGenreDetail(): any {
    // Get already exist genre details from api end-point
    this.restService.get(environment.getAllGenrePath)
      .map((genre: any) => {            // get data or response from the end-point called
        if (genre) {
          genre.data.forEach(erg => {
            this.genreList.push(
              new Genre(erg.genreId, erg.genreName, erg.description)
            );
          });
        }
        return this.genreList;
      })
      .subscribe(() => {
        //genre input pre select in form
        this.genres.push(this.genreList.find(genre => genre.genreId === this.selectedData.movie.genreId)) //push genre details of selected genre ID
      });
  }

  displayFn(genres?: Genre): string | undefined {
    return genres ? genres.genreName : undefined;
  }

  /******************* Mat chips coding Start *********************/
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our Genre
    if ((value || "").trim()) {
      this.genres.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = "";
    }
  }

  remove(genreObj: any): void {
    const index = this.genres.indexOf(genreObj);
    this.genres.splice(index, 1);
    this.editMovieForm.get('genreId').patchValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.genres.push(event.option.value);
    this.editMovieForm.get('genreId').patchValue(event.option.value.genreId);
    this.genreInput.nativeElement.value = "";
  }
  /******************* Mat chips coding End *********************/
}
