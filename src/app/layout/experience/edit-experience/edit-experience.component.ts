import { Component, OnInit } from '@angular/core';
import { Experience } from '../experience';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Status } from '../../../shared/model/response-status-model';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { RestService } from '../../../api.service';
import { TempDataService } from '../../../shared/temp-dataStore';
import { UUID } from '../../../shared/services/uuid';
import { Header } from '../../../shared/services/header';

@Component({
  selector: 'app-edit-experience',
  templateUrl: './edit-experience.component.html',
  styleUrls: ['./edit-experience.component.scss']
})
export class EditExperienceComponent implements OnInit {
  data: any;
  selectedData: Experience;
  isSuccess: boolean = true;
  items: Experience[] = [];
  ioObjArray: Experience[] = [];
  header = new Header(UUID.UUID());
  buttonStatus: boolean;
  error: string;
  constructor(private tempDataService: TempDataService, private restService: RestService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {

  }

  myControl: FormControl = new FormControl();

  clear() {

    let experienceValue = <Experience>({
      name: '',
      description: ''
    });
    this.selectedData = experienceValue;
  }

  ngOnInit() {

    this.log.info("EDIT METHOD");
    this.tempDataService.currentSelectedData.subscribe(selectedData => this.selectedData = selectedData);
    this.buttonStatus = this.selectedData.editable;
    this.log.info("EDIT METHOD=====" + JSON.stringify(this.selectedData));
    JSON.stringify(this.selectedData);
  }


  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");
    let validationMessage = this.validation();
    if (validationMessage == false) {
      this.save(this.selectedData);
    } else {
      this.openSnackBar("Please fill the red marked fields", "all field");
    }
  }
  private save(data: any) {

    data.header = this.header;
    this.restService.post(data, environment.updateVenueCategoryPath)
      .map((res: any) => {
        this.log.info("UPDATE****");
        return new Status(res.status["statusCode"], res.status["statusDescription"], res.status['transactionId']);

      })
      .subscribe(result => {
        this.log.info(JSON.stringify(result));
        if (result.statusCode == '1001') {
          this.openSnackBar(this.selectedData.name, "Saved Successfully");
          this.router.navigate(['/experience']);
        } else {
          this.openSnackBar(this.selectedData.name, result.statusDescription);
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  // Validation part 

  validation() {
    if (this.selectedData.name == '') {
      return 'Name is required!';
    }
    else if (this.selectedData.description == '') {
      return 'Description is required!';
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

  editStatus() {
    if (this.buttonStatus) {
      this.buttonStatus = false;
    }


  }


}