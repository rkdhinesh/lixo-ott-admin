import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Fare } from '../fare';
import { FareResponse } from '../fareResponse';
import { Header } from '../../../shared/services/header';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UUID } from '../../../shared/services/uuid';
import { Headers } from '../../../shared/model/request-header';
import { Charge } from '../../charge/charge';
import { Tax } from '../../tax/tax';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-add-fare',
  templateUrl: './add-fare.component.html',
  styleUrls: ['./add-fare.component.scss']
})
export class AddFareComponent implements OnInit {

  //property declaration
  result: Tax[] = [];
  existingTaxes: Tax[] = [];
  taxes: Array<any> = [];
  percentAdd: number = 0;
  selectedTaxName: string[] = [];
  selectedTaxIds: Array<any> = [];
  createFareForm: FormGroup;
  fareIdExist: boolean = false;
  fareDetails: any;
  @ViewChild('taxInput') taxInput: ElementRef;
  //Tax Input
  selectable = true;
  removable = true;
  addOnBlur = false;
  isTaxesTouched = false;

  //dependency injection
  constructor(
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.getTaxes();      //call getTaxes() method to get tax details
    this.getAllFare();      //call getAllFare() method to get fare details
    //Create a FormGroup for Fare form in HTML
    this.createFareForm = this.formBuilder.group({
      // Create formControl with initial value and apply validation
      fareId: ['', [Validators.required, Validators.pattern(/^Fare_\d+$/)]],
      amount: ['', [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      tax: ['', Validators.required],
      totalAmount: ['',],
      taxIds: []
    })
    //listen to form changes
    this.createFareForm.get('amount').valueChanges.subscribe(() => {
      this.updateTotalAmount();
    })
    //listen to form changes
    this.createFareForm.get('tax').valueChanges.subscribe(() => {
      this.updateTotalAmount();
    })
  }

  getAllFare() {
    // Get fare details from api end-point
    this.restService.get(environment.getAllFarePath)
      .map((response: any) => {            // get data or response from the end-point called
        let fares: Array<Fare> = [];
        if (response.statusCode == 201) {  // Sucessful retrieval
          response.data.forEach(fare => {
            let obj = new Fare(fare.fareId, fare.amount, fare.tax, fare.totalAmount, fare.taxIds);
            fares.push(obj);
          });
        }
        else if (response.statusCode == 204) { // no Content
        }
        return fares;
      }).subscribe(fares => {
        this.fareDetails = fares;
      })
  }

  fareIdFocusOut(event: any) {   // check fare Id exist or not
    this.fareIdExist = false;
    this.fareDetails.forEach(fare => {
      console.log(fare.fareId === event.target.value)
      if (fare.fareId === event.target.value) {
        this.fareIdExist = true;
      } else {
        this.createFareForm.get('amount').patchValue(Number(event.target.value.replace(/^fare_/i, "")));
      }
    })
    if(this.fareDetails.length === 0) {
      this.createFareForm.get('amount').patchValue(Number(event.target.value.replace(/^fare_/i, "")));
    }
  }

  updateTotalAmount() {     // total amount update calculation based on form value changes
    const amountValue = this.createFareForm.get('amount').value;
    const totalAmount = Number(amountValue) * (100 + this.percentAdd) / 100
    this.createFareForm.patchValue({
      totalAmount: totalAmount,
      tax: this.selectedTaxName.toString(),
      taxIds: this.selectedTaxIds
    }, { emitEvent: false })
  }

  //taxes required error show on focus out
  onTaxesBlur() {
    this.isTaxesTouched = true;
  }

 submitForm() {
    const requestBody = JSON.stringify(this.createFareForm.value)      // Fare form data from HTML
    this.restService.post(JSON.parse(requestBody), environment.addFarePath)
      .map((response: any) => {     // get response from the end-point called about post data
        let result = { statusCode: response.statusCode, statusDescription: response.statusDescription }
        return result;
      })
      .subscribe(result => {
        if (result.statusCode == 201) {    // post created successful
          this.openSnackBar(result.statusDescription, 'success-fare-snackbar', '/fare');      // show successful post msg
        } else if (result.statusCode == 202) {     // already exist
          this.openSnackBar(result.statusDescription, 'already-exist-snackbar');     // show already exist msg
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  openSnackBar(message: string, style: string, url?: string) {     // msg panel
    this.snackBar.open(message, '', {
      duration: 2000,           // show msg for 2 sec.
      panelClass: style
    });
    if (url) {
      setTimeout(() => {
        this.router.navigate([url]);
      }, 2000)           // route after 2 sec msg
    }
  }

  private getTaxes() {
    // Get tax details from api end-point
    this.restService.get(environment.getAllTaxPath)
      .map((response: any) => {            // get data or response from the end-point called
        let result = { statusCode: response.statusCode, statusDescription: response.statusDescription, data: response.data }
        return result;
      })
      .subscribe(result => {
        if((result.statusCode == 201)) {
          result.data.forEach((erg) => {
                this.result.push(new Tax(erg.taxId, erg.taxName, erg.taxDescription, erg.taxPercentage));
              });
        } else if ((result.statusCode == 204)) {

        }
      })
  }
  
  displayFns(taxes?: Tax): string | undefined {
    return taxes ? taxes.taxName : undefined;
  }

  //    /******************* Mat chips coding Start *********************/
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    // Add our fruit
    if ((value || '').trim()) {
      this.selectedTaxName.push(value.trim());
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  //taxes dropdown remove item event
  remove(tax: Tax): void {
    const index = this.existingTaxes.indexOf(tax);
    if (index >= 0) {
      this.existingTaxes.splice(index, 1);  // selected tax detail is deleted from array
      this.selectedTaxName.splice(index, 1);  // selected taxName is deleted from array
      this.percentAdd = this.percentAdd - tax.taxPercentage; //tax percentage of selected tax is subtracted from percentAdd property
      this.selectedTaxIds.splice(index, 1);  // selected taxId is deleted from array
      this.updateTotalAmount();
    }
  }

  //taxes dropdown select item event
  selected(event: MatAutocompleteSelectedEvent): void {
    if (!(this.existingTaxes.indexOf(event.option.value) > -1)) {
      this.existingTaxes.push(event.option.value); // entire tax detail of selected tax is pushed to array
      this.percentAdd = this.percentAdd + event.option.value.taxPercentage;
      this.selectedTaxName.push(event.option.value.taxName);  // taxName alone is pushed to array
      this.taxInput.nativeElement.value = '';
      this.selectedTaxIds.push(event.option.value.taxId);  // taxId alone is pushed to array
      this.updateTotalAmount();   //call to update total amount field after updating all properties above
    }
  }

}