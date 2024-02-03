import { Component, OnInit } from '@angular/core';
import { Genre } from '../genre';
import { GenreResponse } from '../genreResponse';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Headers } from '../../../shared/model/request-header';
import { UUID } from '../../../shared/services/uuid';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-add-genre',
  templateUrl: './add-genre.component.html',
  styleUrls: ['./add-genre.component.scss']
})

export class AddGenreComponent implements OnInit {

  //property declaration
  selectedData: Genre;
  createGenreForm: FormGroup;
  genreExist: boolean = false;
  genreDetails: any;

  // dependency injection
  constructor(
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private formbuilder: FormBuilder) {
  }


  ngOnInit() {
    //Create a FormGroup for genre form in HTML
    this.createGenreForm = this.formbuilder.group({
      // Create formControl with initial value and apply validation
      genreName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      description: ['', [Validators.required]]
    })
    this.getAllGenre();  // call getAllGenre() to get genre details
  }

  getAllGenre() {
    // Get genre details from api end-point
    this.restService.get(environment.getAllGenrePath)
      .map((response: any) => {            // get data or response from the end-point called
        let genres: Array<Genre> = [];
        if (response.statusCode == 201) {  // Sucessful retrieval
          response.data.forEach(genre => {
            let obj = new Genre(genre.genreId, genre.genreName, genre.description);
            genres.push(obj);
          });
        }
        else if (response.statusCode == 204) { // no Content
        }
        return genres;
      }).subscribe(genres => {
        this.genreDetails = genres;
      })
  }

  genreNameFocusOut(event: any) {   // check GenreName exist or not
    this.genreExist = false;
    if(this.genreDetails) {
      this.genreDetails.forEach(genre => {
        if (genre.genreName === event.target.value) {
          this.genreExist = true;
        }
      })
    }
  }


  submitForm() {
    const requestBody = JSON.stringify(this.createGenreForm.value)      // Genre form data from HTML
    this.restService.post(JSON.parse(requestBody), environment.addGenrePath)
      .map((response: any) => {     // get response from the end-point called about post data
        let result = response
        return result;
      })
      .subscribe(result => {
        if (result.statusCode == 201) {    // post created successful
          this.openSnackBar(result.statusDescription, 'new-genre-snackbar', '/genre');      // show successful post msg
        } else if (result.statusCode == 202) {     // already exist
          this.openSnackBar(result.statusDescription, 'already-exist-snackbar');     // show already exist msg
        }
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