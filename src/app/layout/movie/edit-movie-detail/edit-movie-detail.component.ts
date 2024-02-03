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
import { MatDialog } from "@angular/material/dialog";
import { MovieDetailService } from "../movie-detail.service";
import { TempDataService } from "../../../shared/temp-dataStore";

@Component({
  selector: 'app-edit-movie-detail',
  templateUrl: './edit-movie-detail.component.html',
  styleUrls: ['./edit-movie-detail.component.css']
})
export class EditMovieDetailComponent implements OnInit {

  //property declaration
  data: any;
  selectedData: MovieDetail;
  editMovieDetailForm: FormGroup;
  routeUrl: string;

  //dependency injection
  constructor(
    private restService: RestService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    private movieDetailService: MovieDetailService,
    private router: Router,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    if (this.movieDetailService.getSelectedMovieDetail()) {  // get Selected movie detils here
      this.data = this.movieDetailService.getSelectedMovieDetail();
      if (this.data.movieDetails) {
        this.selectedData = this.data.movieDetails;
      } else {
        this.selectedData = this.data;
      }
    }
    //Create a FormGroup for Movie Detail form in HTML
    this.editMovieDetailForm = this.formBuilder.group({
      // Create formControl with received value and apply validation
      movieId: [this.selectedData.movieId],
      movieName: [this.selectedData.movieName],
      language: [this.selectedData.language, [Validators.required, Validators.pattern(/^([a-zA-Z]+(?:, [a-zA-Z]+)*)?$/)]],
      subtitles: [this.selectedData.subtitles, [Validators.required, Validators.pattern(/^([a-zA-Z]+(?:, [a-zA-Z]+)*)?$/)]],
      directors: [this.selectedData.directors, [Validators.required, Validators.pattern(/^[a-zA-Z\s'!@#$%^&*(),.?":{}|<>]+$/)]],
      producers: [this.selectedData.producers, Validators.required],
      studio: [this.selectedData.studio, Validators.required],
      starCast: [this.selectedData.starCast, [Validators.required, Validators.pattern(/^[a-zA-Z\s'!@#$%^&*(),.?":{}|<>]+$/)]],
      synopsis: [this.selectedData.synopsis, Validators.required],
    })
  }


  saveDetail() {
    const requestBody = JSON.stringify(this.editMovieDetailForm.value)      // movie detail form data from HTML
    this.restService.put(JSON.parse(requestBody), environment.updateMovieDetailPath + this.selectedData.movieId)
      .map((response: any) => {     // get response from the end-point called about put data
        let result = { statusCode: response.statusCode, statusDescription: response.statusDescription }
        return result;
      })
      .subscribe(result => {
        if (result.statusCode == 201) {    // update successful
          this.openSnackBar(result.statusDescription, 'success-movie-detail-snackbar', '/movie-detail');      // show successful update msg
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

  //click cancel route page
  goBack() {
    this.routeUrl = this.movieDetailService.getPreviousUrl();  // get previous route Url
    this.router.navigate([this.routeUrl]);
  }

}
