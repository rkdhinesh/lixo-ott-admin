import { Component, OnInit } from '@angular/core';
import { Zone } from '../zone';
import { Zoneresponse } from '../zoneresponse';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Headers } from '../../../shared/model/headers';
import { UUID } from '../../../shared/services/uuid';
import { Header } from '../../../shared/services/header';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-edit-zone',
  templateUrl: './edit-zone.component.html',
  styleUrls: ['./edit-zone.component.scss']
})
export class EditZoneComponent implements OnInit {

  selectedId: number;
  data: any;
  selectedData: Zone;
  responseData: Zoneresponse;
  header = new Header(UUID.UUID());
  headers: Headers;

  constructor(private tempDataService: TempDataService, private restService: RestService,
    private router: Router, public snackBar: MatSnackBar,
    private log: LogService) { }

  ngOnInit() {

    this.log.info("EDIT METHOD");
    this.tempDataService.currentSelectedData.subscribe(selectedData => this.selectedData = selectedData);
    // this.buttonStatus = this.selectedData.editable;
    this.log.info("EDIT METHOD=====" + JSON.stringify(this.selectedData));
    JSON.stringify(this.selectedData);

  }

  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");
    if (this.zoneValidation() == true) {
      this.save(this.selectedData);
    } else {
      this.openSnackBar("Please fill the red marked fields", "all field");
    }
  }
  private save(data: any) {
    data.header = this.header;
    this.restService.post(data, environment.updateZonePath)
      .map((zone: any) => {
        this.log.info("UPDATE****");
        let result: Zoneresponse;
        result = new Zoneresponse(zone.status["statusCode"], zone.status["statusDescription"], zone.status["transactionId"]);
        return result;

      })
      .subscribe(result => {
        this.log.info("inside response" + result.statusCode + "" + result.statusDescription + "" + result.transactionId);
        this.responseData = result;
        this.log.info(this.responseData);
        if (this.responseData.statusCode = '1001') {
          // this.getAllDetail();
          this.openSnackBar("Successfully updated", this.selectedData.zoneName);
          this.log.info("--------------" + this.responseData.statusCode);
          this.router.navigate(['/zone'])
          this.ngOnInit();
        } else if (this.responseData.statusCode = '4001') {
          this.openSnackBar(this.responseData.statusDescription, this.selectedData.zoneName);
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
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

