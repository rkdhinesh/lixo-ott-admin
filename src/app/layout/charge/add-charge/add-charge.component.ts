import { Charge } from '../charge';
import { ChargeResponse } from '../chargeResponse';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { Headers } from '../../../shared/model/request-header';
import { UUID } from '../../../shared/services/uuid';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { Tax } from '../tax';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';
export class ChargeRequest {
  header = new Header(UUID.UUID());
  chargeId: number;
  chargeName: string;
  chargeDescription: string;
  chargeAmount: 0;
  gateWayPercentage: 0;
  vendorPercentage: 0;
  taxIds: Array<any>;
  constructor() { }
}

@Component({
  selector: 'app-add-charge',
  templateUrl: './add-charge.component.html',
  styleUrls: ['./add-charge.component.scss']
})
export class AddChargeComponent implements OnInit {
  data: any;
  selectedData: Charge;
  responseData: ChargeResponse;
  isSuccess: boolean = true;
  items: Charge[] = [];
  ioObjArray: Charge[] = [];
  headers: Headers;
  header = new Header(UUID.UUID());
  taxArr: Tax;
  result: Tax[] = [];

  taxList: any[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredTaxes: Observable<string[]>;
  taxIds: Array<any> = [];
  existingTaxes: Tax[] = [];
  taxes: any[] = [];


  constructor(private restService: RestService, private route: ActivatedRoute,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) { }

  myControl: FormControl = new FormControl();
  taxControl: FormControl = new FormControl();
  @ViewChild('taxInput') taxInput: ElementRef;
  loadDefaultValues() {

    let chargeValue = <Charge><unknown>({
      chargeAmount: 0,
      chargeName: '',
      chargeDescription: '',
      gateWayPercentage: 0,
      vendorPercentage: 0,
      tax: this.taxList
    });
    this.selectedData = chargeValue;

  }

  ngOnInit() {

    this.headers = <Headers>{
      header: this.header
    }
    this.getTaxes();
    this.loadDefaultValues();

  }

  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.chargeValidation() == true) {
      debugger
      this.save();
    } else {
      this.openSnackBar("Please fill the red marked fields", "all field");
    }
  }
  private save() {
    let request = <ChargeRequest>({});
    request.header = this.header;

    request.chargeId = this.selectedData.chargeId;
    request.chargeName = this.selectedData.chargeName;
    request.chargeDescription = this.selectedData.chargeDescription;
    request.chargeAmount = this.selectedData.chargeAmount;
    request.gateWayPercentage = this.selectedData.gateWayPercentage;
    request.vendorPercentage = this.selectedData.vendorPercentage;

    for (let tax of this.existingTaxes) {
      this.taxes.push(tax.taxId);
    }
    request.taxIds = Array.from(new Set(this.taxes));
    debugger;

    this.restService.post(request, environment.addChargePath)
      .map((charge: any) => {

        this.log.info("SAVE****");
        let result: ChargeResponse;
        result = new ChargeResponse(charge.status["statusCode"], charge.status["statusDescription"], charge.status["transactionId"]);
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
          this.openSnackBar("Successfully Saved", this.selectedData.chargeName);
          this.log.info("--------------" + this.responseData.statusCode);
          this.router.navigate(['/charge'])
          this.ngOnInit();
        } else if (this.responseData.statusCode == '1002') {
          this.openSnackBar(this.responseData.statusDescription, this.selectedData.chargeName);
        } else if (this.responseData.statusCode == '4001') {
          this.openSnackBar(this.responseData.statusDescription, this.selectedData.chargeName);
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }


  // Validation part 

  validation() {
    if (this.selectedData.chargeName == '') {
      return 'charge Name is required!';
    }
    else if (this.selectedData.chargeDescription == '') {
      return 'charge Description is required!';
    }


    else {
      return false;
    }
  }

  chargeValidation() {
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

  private getTaxes() {
    this.restService.post(this.headers, environment.getAllTaxPath)
      .map((allTaxes: Array<any>) => {
        if (allTaxes) {
          let taxesArray = allTaxes["taxes"];
          taxesArray.forEach((erg) => {
            this.ioObjArray = erg;
            this.result.push(new Tax(erg.taxId, erg.taxName, erg.taxDescription, erg.taxPercentage));
          });
        }
        return this.result;
      })
      .subscribe(Taxes => {
        this.result = Taxes;

      })

  }
  displayFn(taxes?: Tax): string | undefined {
    return taxes ? taxes.taxName : undefined;
  }
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {
      this.taxIds.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.taxControl.setValue(null);
  }
  remove(tax: Tax): void {
    const index = this.existingTaxes.indexOf(tax);
    if (index >= 0) {
      this.taxIds.splice(index, 1);
      this.existingTaxes.splice(index, 1);
    }
  }
  selected(event: MatAutocompleteSelectedEvent): void {
    debugger;
    if (!(this.existingTaxes.indexOf(event.option.value) > -1)) {
    this.taxIds.push(event.option.viewValue);

    this.existingTaxes.push(event.option.value);
    this.selectedData.tax.push(event.option.value.taxId)
    }
    this.taxInput.nativeElement.value = '';
    this.taxControl.setValue(null);

  }

  /******************* Mat chips coding End *********************/
}



