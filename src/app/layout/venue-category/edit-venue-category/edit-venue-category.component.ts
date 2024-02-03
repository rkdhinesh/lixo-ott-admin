import { Component, OnInit } from '@angular/core';
import { VenueCategory } from '../venue-category';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { UUID } from '../../../shared/services/uuid';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';
import { Status } from '../../../shared/model/response-status-model';

@Component({
  selector: 'app-edit-venue-category',
  templateUrl: './edit-venue-category.component.html',
  styleUrls: ['./edit-venue-category.component.scss']
})
export class EditVenueCategoryComponent implements OnInit {

  data: any;
  selectedData: VenueCategory;
  isSuccess: boolean = true;
  items: VenueCategory[] = [];
  ioObjArray: VenueCategory[] = [];
  header = new Header(UUID.UUID());
  buttonStatus: boolean;

  constructor(private tempDataService: TempDataService, private restService: RestService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {

  }

  myControl: FormControl = new FormControl();

  clear() {

    let venueCategoryValue = <VenueCategory>({
      synopsis: '',
      venueCategoryName: ''
    });
    this.selectedData = venueCategoryValue;
  }

  ngOnInit() {debugger;

    this.log.info("EDIT METHOD");
    this.tempDataService.currentSelectedData.subscribe(selectedData => this.selectedData = selectedData);
    this.buttonStatus = this.selectedData.editable;
    this.log.info("EDIT METHOD=====" + JSON.stringify(this.selectedData));
    JSON.stringify(this.selectedData);
  }


  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.venueCategoryValidation() == true) {
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
          this.openSnackBar(this.selectedData.venueCategoryName, "Saved Successfully");
          this.router.navigate(['/venue-category']);
        } else {
          this.openSnackBar(this.selectedData.venueCategoryName, result.statusDescription);
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  // Validation part 

  validation() {
    if (this.selectedData.venueCategoryName == '') {
      return 'venueCategoryName is required!';
    }
    else if (this.selectedData.venueCategoryId == null) {
      return 'venueCategoryId is required!';
    }

    else {
      return false;
    }
  }

  venueCategoryValidation() {
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





