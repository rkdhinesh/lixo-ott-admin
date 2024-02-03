import { Component, OnInit } from '@angular/core';
import { Tax } from '../tax';
import { TaxResponse } from '../taxResponse';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Headers } from '../../../shared/model/request-header';
import { UUID } from '../../../shared/services/uuid';
import { Header } from '../../../shared/services/header';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-add-tax',
  templateUrl: './add-tax.component.html',
  styleUrls: ['./add-tax.component.scss']
})
export class AddTaxComponent implements OnInit {

  //property declaration
  selectedData: Tax;
  createTaxForm: FormGroup;
  taxDetails: any;
  taxExist: boolean = false;

  // dependency injection
  constructor(
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    //Create a FormGroup for Tax form in HTML
    this.createTaxForm = this.formBuilder.group({
      // Create formControl with initial value and apply validation
      taxName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      taxDescription: ['', Validators.required],
      taxPercentage: [0, [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]]
    });
    this.getAllTax();   // call getAllTax() to get tax details
  }

  getAllTax() {
    // Get tax details from api end-point
    this.restService.get(environment.getAllTaxPath)
      .map((response: any) => {       // get data or response from the end-point called
        let taxes: Array<Tax> = [];
        if (response.statusCode == 201) {   // Sucessful retrieval
          response.data.forEach(tax => {
            let obj = new Tax(tax.taxId, tax.taxName, tax.taxDescription, tax.taxPercentage);
            taxes.push(obj);
          });
        }
        else if (response.statusCode == 204) {   // no Content
        }
        return taxes;
      }).subscribe(taxes => {
        this.taxDetails = taxes;
      })
  }

  taxNameFocusOut(event: any) {      // check TaxName exist or not
    this.taxExist = false;
    console.log(this.taxDetails)
    this.taxDetails.forEach(tax => {
      console.log(tax.genreName === event.target.value)
      if (tax.taxName === event.target.value) {
        this.taxExist = true;
      }
    })
  }

  submitForm() {
    const requestBody = JSON.stringify(this.createTaxForm.value)     // Tax form data from HTML
    this.restService.post(JSON.parse(requestBody), environment.addTaxPath)
      .map((response: any) => {       // get response from the end-point called about post data
        let result = { statusCode: response.statusCode, statusDescription: response.statusDescription }
        return result;

      })
      .subscribe(result => {
        if (result.statusCode == 201) {    // post created successful
          this.openSnackBar(result.statusDescription, 'success-tax-snackbar', '/tax');  // show successful post msg
        } else if (result.statusCode == 202) {  // already exist
          this.openSnackBar(result.statusDescription, 'already-exist-snackbar'); // show already exist msg
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", err)
      });
  }

  openSnackBar(message: string, style: string, url?: string) {   // msg panel
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

}