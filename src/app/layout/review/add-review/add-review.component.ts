import { Component, OnInit } from '@angular/core';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Headers } from '../../../shared/model/request-header';
import { UUID } from '../../../shared/services/uuid';
import { Review } from '../review';
import { ReviewResponse } from '../reviewResponse';
import { Header } from '../../../shared/services/header';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-review',
  templateUrl: './add-review.component.html',
  styleUrls: ['./add-review.component.scss']
})
export class AddReviewComponent implements OnInit {

  data: any;
  selectedData: Review;
  responseData: ReviewResponse;
  isSuccess: boolean = true;
  items: Review[] = [];
  ioObjArray: Review[] = [];
  headers: Headers;
  header = new Header(UUID.UUID());

  constructor(private restService: RestService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {



  }
  myControl: FormControl = new FormControl();


  loadDefaultValues() {

    let reviewValue = <Review>({
      experienceName: '',
      experienceDesc: ''

    });
    this.selectedData = reviewValue;

  }

  ngOnInit() {
    this.headers = <Headers>{
      header: this.header
    }
    this.loadDefaultValues();
  }

  ///* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.reviewValidation() == true) {
      this.save();
    } else {
      this.openSnackBar("Please fill the red marked fields", "all field");
    }
  }
  private save() {

    this.selectedData.header = this.header;
    this.restService.post(this.selectedData, environment.addReviewPath)
      .map((reviewObj: any) => {
        this.log.info("SAVE****");
        let result: ReviewResponse;
        result = new ReviewResponse(reviewObj.status["statusCode"], reviewObj.status["statusDescription"], reviewObj.status["transactionId"]);
        return result;

      })
      .subscribe(result => {
        this.log.info("inside response" + result.statusCode + "" + result.statusDescription + "" + result.transactionId);
        this.responseData = result;
        this.log.info(this.responseData);
        if (this.responseData.statusCode == '1001') {
          this.isSuccess = true;
          //this.getAllDetail();
          this.log.info("--------------" + this.isSuccess)
          this.openSnackBar("Successfully Saved", this.selectedData.experienceName);
          this.log.info("--------------" + this.responseData.statusCode);
          this.router.navigate(['/review'])
          this.ngOnInit();
        } else if (this.responseData.statusCode == '1002') {
          this.openSnackBar(this.responseData.statusDescription, this.selectedData.experienceName);
        } else if (this.responseData.statusCode == '1004') {
          this.openSnackBar(this.responseData.statusDescription, "experiencename already exit");
        } else if (this.responseData.statusCode == '4001') {
          this.openSnackBar(this.responseData.statusDescription, this.selectedData.experienceName);
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  // Validation part 

  validation() {
    if (this.selectedData.experienceName == '') {
      return 'experienceName is required!';
    } else if (this.selectedData.experienceDesc == '') {
      return 'Description is required!';
    }
    else {
      return false;
    }
  }

  reviewValidation() {
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

}