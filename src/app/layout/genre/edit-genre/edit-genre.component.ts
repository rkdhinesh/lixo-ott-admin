import { Component, OnInit } from '@angular/core';
import { Genre } from '../genre';
import { GenreResponse } from '../genreResponse';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Headers } from '../../../shared/model/request-header';
import { UUID } from '../../../shared/services/uuid';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';

@Component({
  selector: 'app-edit-genre',
  templateUrl: './edit-genre.component.html',
  styleUrls: ['./edit-genre.component.scss']
})
export class EditGenreComponent implements OnInit {

  //property declaration
  selectedData: Genre;
  editGenreForm: FormGroup;

  //dependency injection
  constructor(private tempDataService: TempDataService,
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.tempDataService.currentSelectedData.subscribe(  // get clicked genre details
      selectedData => this.selectedData = selectedData
    );
    //Create a FormGroup for genre form in HTML
    this.editGenreForm = this.formBuilder.group({
      // Create formControl with received value and apply validation
      genreName: [this.selectedData.genreName, [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      description: [this.selectedData.description, Validators.required]
    })
  }

  saveDetail() {
    const request = JSON.stringify(this.editGenreForm.value)    // Genre form data from HTML
    this.restService.put(JSON.parse(request), environment.updateGenrePath + this.selectedData.genreId)
      .map((response: any) => {     // get response from the end-point called about update data
        let result = { statusCode: response.statusCode, statusDescription: response.statusDescription }
        return result;
      })
      .subscribe(result => {
        if (result.statusCode == 201) {  // update Successful
          this.openSnackBar(result.statusDescription, 'success-genre-snackbar', '/genre'); // show successful update msg
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal, '')
      });
  }

  openSnackBar(message: string, style: string, url: string) {   // msg panel
    this.snackBar.open(message, '', {
      duration: 2000,      // show msg for 2 sec.
      panelClass: style
    });
    setTimeout(() => {
      this.router.navigate([url]);
    }, 2000)           // route after 2 sec msg
  }

}
