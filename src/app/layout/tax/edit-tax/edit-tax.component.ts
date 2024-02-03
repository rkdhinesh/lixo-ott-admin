import { Component, OnInit, ViewChild } from '@angular/core';
import { Tax } from '../tax';
import { TaxResponse } from '../taxResponse';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Headers } from '../../../shared/model/request-header';
import { UUID } from '../../../shared/services/uuid';
import { Header } from '../../../shared/services/header';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-edit-tax',
  templateUrl: './edit-tax.component.html',
  styleUrls: ['./edit-tax.component.scss'],
})
export class EditTaxComponent implements OnInit {

  //property declaration
  selectedData: Tax;
  editTaxForm: FormGroup;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;

  // dependency injection
  constructor(
    private tempDataService: TempDataService,
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.tempDataService.currentSelectedData.subscribe(   // get clicked tax details here
      (selectedData) => (this.selectedData = selectedData)
    );
    //Create a FormGroup for Tax form in HTML
    this.editTaxForm = this.formBuilder.group({
      // Create formControl with received value and apply validation
      taxName: [this.selectedData.taxName, [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]],
      taxDescription: [this.selectedData.taxDescription, Validators.required],
      taxPercentage: [this.selectedData.taxPercentage, [Validators.required, Validators.pattern(/^[1-9][0-9]*$/)]]
    })
  }

  saveDetail() {
    const request = JSON.stringify(this.editTaxForm.value)  // Tax form data from HTML
    this.restService
      .put(JSON.parse(request), environment.updateTaxPath + this.selectedData.taxId)
      .map((response: any) => {   // get response from the end-point called about put data
        let result = { statusCode: response.statusCode, statusDescription: response.statusDescription }
        return result;
      })
      .subscribe(
        (result) => {
          if (result.statusCode == 201) {     // update successful
            this.openSnackBar(result.statusDescription, 'success-tax-snackbar', '/tax');  // show successful update msg
          } else if (result.statusCode == 202) {
            this.openSnackBar(result.statusDescription, 'already-exist-snackbar');
          }
        },
        (err) => {
          var errorVal = err.status.statusDescription;
          this.openSnackBar('ERROR MSG', '', errorVal);
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
        this.router.navigate([url]);
      }, 2000)           // route after 2 sec msg
    }
  }

}
