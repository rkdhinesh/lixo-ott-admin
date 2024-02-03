import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Fare } from '../fare';
import { FareResponse } from '../fareResponse';
import { Header } from '../../../shared/services/header';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UUID } from '../../../shared/services/uuid';
import { Headers } from '../../../shared/model/request-header';
import { TempDataService } from '../../../shared/temp-dataStore';
import { Charge } from '../../charge/charge';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Tax } from '../../tax/tax';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-edit-fare',
  templateUrl: './edit-fare.component.html',
  styleUrls: ['./edit-fare.component.scss'],
})
export class EditFareComponent implements OnInit {

  //property declaration
  selectedData: Fare;
  result: Tax[] = [];
  existingTaxes: Tax[] = [];
  selectedTaxIds: Array<any> = [];
  percentAdd: number = 0;
  selectedTaxName: string[] = [];
  editFareForm: FormGroup;
  @ViewChild('taxInput') taxInput: ElementRef;
  //Tax Input
  selectable = true;
  removable = true;
  addOnBlur = false;

  //dependency injection
  constructor(
    private tempDataService: TempDataService,
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private log: LogService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.tempDataService.currentSelectedData.subscribe(   // get clicked fare details here
      (selectedData) => {
        this.selectedData = selectedData
      }
    );
    //Create a FormGroup for fare form in HTML
    this.editFareForm = this.formBuilder.group({
      // Create formControl with received value and apply validation
      fareId: [this.selectedData.fareId],
      amount: [this.selectedData.amount, [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]],
      tax: ['', Validators.required],
      totalAmount: [this.selectedData.totalAmount],
      taxIds: ['']
    })
    //listen to form changes
    this.editFareForm.get('amount').valueChanges.subscribe(() => {
      this.updateTotalAmount();
    })
    //listen to form changes
    this.editFareForm.get('tax').valueChanges.subscribe(() => {
      this.updateTotalAmount();
    })
    this.getTaxes();    //call getTaxes() method to get tax details
  }

  updateTotalAmount() {      // total amount update calculation based on form value changes
    const amountValue = this.editFareForm.get('amount').value;
    const totalAmount = Number(amountValue) * (100 + this.percentAdd) / 100
    this.editFareForm.patchValue({
      totalAmount: totalAmount,
      tax: this.selectedTaxName.toString(),
      taxIds: this.selectedTaxIds
    }, { emitEvent: false })
  }


  saveDetail() {
    const requestBody = JSON.stringify(this.editFareForm.value)  // fare form data from HTML
    this.restService
      .put(JSON.parse(requestBody), environment.updateFarePath + this.selectedData.fareId)
      .map((response: any) => {   // get response from the end-point called about put data
        let result = { statusCode: response.statusCode, statusDescription: response.statusDescription }
        return result;
      })
      .subscribe(
        (result) => {
          if (result.statusCode == 201) {     // update successful
            this.openSnackBar(result.statusDescription, 'success-fare-snackbar', '/fare');  // show successful update msg
          }
        },
        (err) => {
          var errorVal = err.status.statusDescription;
          this.openSnackBar('ERROR MSG', errorVal);
        }
      );
  }

  openSnackBar(message: string, style: string, url?: string) {  // msg panel
    this.snackBar.open(message, '', {
      duration: 2000,           // show msg for 2 sec.
      panelClass: style
    });
    if (url) {
      setTimeout(() => {
        this.router.navigate([url])
      }, 2000)           // route after 2 sec msg
    }
  }

  private getTaxes() {
    // Get tax details from api end-point
    this.restService.get(environment.getAllTaxPath)
      .map((allTaxes: any) => {            // get data or response from the end-point called
        if (allTaxes) {
          allTaxes.data.forEach((erg) => {
            this.result.push(new Tax(erg.taxId, erg.taxName, erg.taxDescription, erg.taxPercentage));
          });
        }
        return this.result;
      })
      .subscribe(Taxes => {
        this.result = Taxes;
        //loop through already selected taxes Id array
        for (let Id of this.selectedData.taxIds) {
          //filter tax details of already selected tax by Id matching with Id of result array
          const matchTax = this.result.find(tax => tax.taxId == String(Id))
          //calculate total tax percentage of already selected taxes
          this.percentAdd = this.percentAdd + matchTax.taxPercentage;
          //already selected taxes Names only are pushed to the array
          this.selectedTaxName.push(matchTax.taxName)
          //already selceted taxes entire details are pushed to the array
          this.existingTaxes.push(matchTax)
          this.selectedTaxIds.push(matchTax.taxId)  //already selected taxes Ids only pushed to the array
        }
      })

  }

  displayFns(taxes?: Tax): string | undefined {
    return taxes ? taxes.taxName : undefined;
  }

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
  remove(tax: any): void {
    const index = this.existingTaxes.indexOf(tax);
    if (index >= 0) {
      this.existingTaxes.splice(index, 1);
      this.selectedTaxName.splice(index, 1);
      this.percentAdd = this.percentAdd - tax.taxPercentage;
      this.selectedTaxIds.splice(index, 1);
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
