import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Charge } from '../charge';
import { ChargeResponse } from '../chargeResponse';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { Headers } from '../../../shared/model/request-header';
import { UUID } from '../../../shared/services/uuid';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { Tax } from '../../tax/tax';
import { Header } from '../../../shared/services/header';
import { LogService } from '../../../shared/services/log.service';

@Component({
  selector: 'app-view-charge',
  templateUrl: './view-charge.component.html',
  styleUrls: ['./view-charge.component.scss']
})
export class ViewChargeComponent implements OnInit {
  data: any;
  selectedData: Charge;
  responseData: ChargeResponse;
  isSuccess: boolean = true;
  items: Charge[] = [];
  ioObjArray: Charge[] = [];
  headers: Headers;
  header = new Header(UUID.UUID());
  buttonStatus: boolean;
  taxList: Array<Tax> = [];
  totalItems: Tax[] = [];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredGenres: Observable<string[]>;
  genres: string[] = [];
  durations: string[] = [];
  updateChargePath = "/api/rest/v1/charge/update";
  getAllTaxPath: string = "";
  taxIds: Array<any>= [];

  taxNames: string[]=[];

  taxControl: FormControl = new FormControl();

  @ViewChild('taxInput') taxInput: ElementRef;
  constructor(private tempDataService: TempDataService, private restService: RestService,
    private route: ActivatedRoute, private router: Router, public snackBar: MatSnackBar,
    private log: LogService) { }
  myControl: FormControl = new FormControl();

  clear() {

    let chargeValue = <Charge>({
      chargeId: 0,
      chargeName: '',
      chargeDescription: '',
      chargeAmount: 0,
      gateWayPercentage: 0,
      vendorPercentage: 0
    });
    this.selectedData = chargeValue;
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
    this.log.info("EDIT METHOD");
    this.tempDataService.currentSelectedData.subscribe(selectedData => this.selectedData = selectedData);
   // this.buttonStatus = this.selectedData.editable;
    this.myControl = new FormControl({ value: '', disabled: this.buttonStatus })
    this.taxControl = new FormControl({ value: '', disabled: this.buttonStatus })
    this.log.info("EDIT METHOD=====" + JSON.stringify(this.selectedData));
    JSON.stringify(this.selectedData);
    for(let tax of this.selectedData.tax)
    {
      this.taxNames.push(tax.taxName);
    }
  }


  /* Save Details**/
  public saveDetail() {
    this.log.info("SAVE METHOD");

    if (this.chargeValidation() == true) {
      this.save(this.selectedData);
    } else {
      this.openSnackBar("Please fill the red marked fields", "all field");
    }
  }
  private save(data: any) {

    data.header = this.header;
    this.restService.post(data, this.updateChargePath)
      .map((charge: any) => {
        this.log.info("UPDATE****");
        let result: ChargeResponse;
        result = new ChargeResponse(charge.status["statusCode"], charge.status["statusDescription"], charge.status["transactionId"]);
        return result;

      })
      .subscribe(result => {
        this.log.info("inside response" + result.statusCode + "" + result.statusDescription + "" + result.transactionId);
        this.responseData = result;
        this.log.info(this.responseData);
        if (this.responseData.statusCode = '1001') {
          // this.getAllDetail();
          this.openSnackBar("Successfully updated", this.selectedData.chargeName);
          this.log.info("--------------" + this.responseData.statusCode);
          this.router.navigate(['/charge']);
          this.ngOnInit();
        } else if (this.responseData.statusCode = '4001') {
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
      return 'charge_Name is required!';
    }
    else if (this.selectedData.chargeDescription == '') {
      return 'charge_description is required!';
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


  Tax
  /* Get Genre Details**/
  private getAllTaxDetail(): any {
    this.restService.post(this.headers, this.getAllTaxPath)
      .map((tax: Array<any>) => {
        if (tax) {
          let taxArray = tax["tax"];
          taxArray.forEach((erg) => {
            this.taxList.push(new Tax(erg.taxId, erg.taxName, erg.taxDescription, erg.taxPercentage));
          });
        }
        this.totalItems = this.taxList;
        return this.taxList;
      })
      .subscribe(tax => {
        debugger
        this.selectedData.tax.forEach((erg) => {
          tax.map((tax: any) => {
            if (tax.taxId == erg) {
              this.taxIds.push(tax.taxName);
            }
      })
     })
      })
    }
  displayFn(taxes?: Tax): string | undefined {
    return taxes ? taxes.taxName : undefined;
  }

  /******************* Mat chips coding Start *********************/
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
  remove(tax: string): void {
    const index = this.taxIds.indexOf(tax);
    if (index >= 0) {
      this.taxIds.splice(index, 1);
    }
  }
  debugger;
  selected(event: MatAutocompleteSelectedEvent): void {
    this.taxIds.push(event.option.viewValue);
    this.selectedData.taxIds.push(event.option.value)
    this.taxInput.nativeElement.value = '';
    this.taxControl.setValue(null);
  }

  /******************* Mat chips coding End *********************/

  editStatus() {
    if (this.buttonStatus) {
      this.buttonStatus = false;
      this.myControl.enable();
      this.taxControl.enable();
    }
  }

  public show: boolean = false;
  toggle() {
    this.show = !this.show;
  }
}
