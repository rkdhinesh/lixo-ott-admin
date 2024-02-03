import { Component, OnInit } from '@angular/core';
import { Experience } from '../experience';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Headers } from '../../../shared/model/request-header';
import { Header } from '../../../shared/services/header';
import { RestService } from '../../../../app/api.service';
import { UUID } from '../../../shared/services/uuid';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';
import { Status } from '../../../shared/model/response-status-model';

@Component({
  selector: 'app-add-experience',
  templateUrl: './add-experience.component.html',
  styleUrls: ['./add-experience.component.scss']
})
export class AddExperienceComponent implements OnInit {
  data: any;
  selectedData: Experience;
  responseData: Status;
  isSuccess: boolean = true;
  items: Experience[] = [];
  ioObjArray: Experience[] = [];
  headers: Headers;
  header = new Header(UUID.UUID());
  error: string;
  constructor(private restService: RestService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {



  }
  myControl: FormControl = new FormControl();


  loadDefaultValues() {

    let experienceValue = <Experience>({
      name: '',
      description: ''
    });
    this.selectedData = experienceValue;

  }

  ngOnInit() {
    this.header = <Header>{
      callingAPI: "string",
      channel: "admin",
      transactionId: UUID.UUID()
    }
    this.headers = <Headers>{
      header: this.header
    }
    this.loadDefaultValues();
  }

  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.experienceValidation() == true) {
      this.save();
    } else {
      this.openSnackBar("Please fill the red marked fields", "all field");
    }
  }
  private save() {

    this.selectedData.header = this.header;
    this.restService.post(this.selectedData, environment.addVenueCategoryPath)
      .map((res: any) => {
        this.log.info("SAVE****");
        let result: Status;
        result = new Status(res.status["statusCode"], res.status["statusDescription"], res.status['transactionId']);
        return result;
      })
      .subscribe(result => {
        this.log.info(JSON.stringify(result));
        this.responseData = result;
        if (this.responseData.statusCode == '1001') {
          this.isSuccess = true;
          this.log.info("--------------" + this.isSuccess)
          this.openSnackBar(this.selectedData.name, "Saved Successfully");
          this.router.navigate(['/review']);
          this.ngOnInit();
        } else if (this.responseData.statusCode == '4001') {
          this.openSnackBar(this.selectedData.name, this.responseData.statusDescription);
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  // Validation part 

  validation() {
    if (this.selectedData.name == '') {
      return 'venueCategoryName is required!';
    } else if (this.selectedData.description == '') {
      return 'description is required!';
    }

    else {
      return false;
    }
  }

  experienceValidation() {
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

