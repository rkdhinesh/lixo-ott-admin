import { Component, OnInit } from '@angular/core';
import { Genre } from '../genre';
import { GenreResponse } from '../genreResponse';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Headers } from '../../../shared/model/request-header';
import { UUID } from '../../../shared/services/uuid';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';
@Component({
  selector: 'app-view-genre',
  templateUrl: './view-genre.component.html',
  styleUrls: ['./view-genre.component.scss']
})
export class ViewGenreComponent implements OnInit {

  data: any;
  selectedData: Genre;
  responseData: GenreResponse;
  isSuccess: boolean = true;
  items: Genre[] = [];
  ioObjArray: Genre[] = [];
  headers: Headers;
  header = new Header(UUID.UUID());
  buttonStatus: boolean;

  updateGenrePath = '/api/rest/v1/manage-movies/update-genre';
  constructor(private tempDataService: TempDataService, private restService: RestService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) { }
  myControl: FormControl = new FormControl();

  clear() {

    let genreValue = <Genre>({
      genreId: 0,
      genreName: '',
      description: ''
    });
    this.selectedData = genreValue;
  }
  ngOnInit() {
   
    this.headers = <Headers>{
      header: this.header
    }
    this.log.info("EDIT METHOD");
    this.tempDataService.currentSelectedData.subscribe(selectedData => this.selectedData = selectedData);
    this.buttonStatus = this.selectedData.editable;
    this.log.info("EDIT METHOD=====" + JSON.stringify(this.selectedData));
    JSON.stringify(this.selectedData);
  }


  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.genreValidation() == true) {
      this.save(this.selectedData);
    } else {
      this.openSnackBar("Please fill the red marked fields", "all field");
    }
  }
  private save(data: any) {

    data.header = this.header;
    this.restService.post(data, this.updateGenrePath)
      .map((genre: any) => {
        this.log.info("UPDATE****");
        let result: GenreResponse;
        result = new GenreResponse(genre.status["statusCode"], genre.status["statusDescription"], genre.status["transactionId"]);
        return result;

      })
      .subscribe(result => {
        this.log.info("inside response" + result.statusCode + "" + result.statusDescription + "" + result.transactionId);
        this.responseData = result;
        this.log.info(this.responseData);
        if (this.responseData.statusCode = '1001') {
          // this.getAllDetail();
          this.openSnackBar("Successfully updated", this.selectedData.genreName);
          this.log.info("--------------" + this.responseData.statusCode);
          this.router.navigate(['/genre']);
          this.ngOnInit();
        } else if (this.responseData.statusCode = '4001') {
          this.openSnackBar(this.responseData.statusDescription, this.selectedData.genreName);
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  // Validation part 

  validation() {
    if (this.selectedData.genreName == '') {
      return 'genreName is required!';
    }
    else if (this.selectedData.description == '') {
      return 'description is required!';
    }

    else {
      return false;
    }
  }

  genreValidation() {
    if (this.validation() == false) {
      return true;
    } else {
      return false;
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  myErrorStateMatcher(): boolean {
    return true;
  }

  editStatus() {
    if (this.buttonStatus) {
      this.buttonStatus = false;
    }

  }


}