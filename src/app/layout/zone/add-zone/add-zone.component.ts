import { Component, OnInit } from '@angular/core';
import { Zone } from '../zone';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Zoneresponse } from '../zoneresponse';
import { RestService } from '../../../api.service';
import { UUID } from '../../../shared/services/uuid';
import { Headers } from '../../../shared/model/request-header';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';

@Component({
  selector: 'app-add-zone',
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.scss']
})
export class AddZoneComponent implements OnInit {

  data: any;
  selectedData: Zone;
  responseData: Zoneresponse;
  isSuccess: boolean = true;
  ioObjArray: Zone[] = [];
  header = new Header(UUID.UUID());
  headers: Headers;



  constructor(private restService: RestService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) { }

  myControl: FormControl = new FormControl();



  loadDefaultValues() {

    let zoneValue = <any>({
      header: this.header,
      zoneName: '',
    });
    this.selectedData = zoneValue;
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
    if (this.zoneValidation() == true) {
      this.save();
    } else {
      //this.openSnackBar("Please fill the red marked fields", "all field");
    }
  }
  private save() {
    this.restService.post(this.selectedData, environment.addZonePath)
      .map((zone: any) => {
        this.log.info("SAVE****");
        let result: Zoneresponse;
        result = new Zoneresponse(zone.status["statusCode"], zone.status["statusDescription"], zone.status["transactionId"]);
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
          this.openSnackBar("Successfully Saved", this.selectedData.zoneName);
          this.log.info("--------------" + this.responseData.statusCode);
          this.router.navigate(['/zone'])
          this.ngOnInit();
        } else if (this.responseData.statusCode == '4001') {
          this.openSnackBar(this.responseData.statusDescription, this.selectedData.zoneName);
        } else if (this.responseData.statusCode == '1002') {
          this.openSnackBar(this.responseData.statusDescription, this.selectedData.zoneName);
        } else {
          this.openSnackBar(this.responseData.statusDescription, "error");
        }

      });
  }

  // Validation part 

  validation() {
    if (this.selectedData.zoneName == '') {
      return 'ZoneName is required!';
    }
    else {
      return false;
    }
  }

  zoneValidation() {
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
