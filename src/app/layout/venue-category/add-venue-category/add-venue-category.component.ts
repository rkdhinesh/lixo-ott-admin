import { Component, OnInit } from '@angular/core';
import { VenueCategory } from '../venue-category';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { UUID } from '../../../shared/services/uuid';
import { Headers } from '../../../shared/model/request-header';
import { environment } from '../../../../environments/environment';
import { Header } from '../../../shared/services/header';
import { LogService } from '../../../shared/services/log.service';
import { Status } from '../../../shared/model/response-status-model';

@Component({
  selector: 'app-add-venue-category',
  templateUrl: './add-venue-category.component.html',
  styleUrls: ['./add-venue-category.component.scss']
})
export class AddVenueCategoryComponent implements OnInit {


  data: any;
  selectedData: VenueCategory;
  isSuccess: boolean = true;
  items: VenueCategory[] = [];
  ioObjArray: VenueCategory[] = [];
  headers: Headers;
  header = new Header(UUID.UUID());

  constructor(private restService: RestService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {



  }
  myControl: FormControl = new FormControl();


  loadDefaultValues() {

    let venueCategoryValue = <VenueCategory>({
      synopsis: '',
      venueCategoryName: ''
    });
    this.selectedData = venueCategoryValue;

  }

  ngOnInit() {
    
    this.headers = <Headers>{
      header: this.header
    }
    this.loadDefaultValues();
  }

  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.venueCategoryValidation() == true) {
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


}

