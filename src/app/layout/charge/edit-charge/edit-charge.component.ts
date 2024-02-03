import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { Charge } from '../charge';
import { ChargeResponse } from '../chargeResponse';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { Headers } from '../../../shared/model/request-header';
import { UUID } from '../../../shared/services/uuid';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Tax } from '../../tax/tax';
import { environment } from '../../../../environments/environment';
import { Header } from '../../../shared/services/header';
import { LogService } from '../../../shared/services/log.service';
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
  selector: 'app-edit-charge',
  templateUrl: './edit-charge.component.html',
  styleUrls: ['./edit-charge.component.scss'],
})
export class EditChargeComponent implements OnInit {
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
  taxes: any[] = [];
  taxIds: Array<any> = [];
  visible = true;
  selectable = true;
  removable = true;
  result: Tax[] = [];
  addOnBlur = false;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  durations: string[] = [];

  existingTaxes: Tax[] = [];

  taxArr: Tax;

  taxControl: FormControl = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  @ViewChild('taxInput') taxInput: ElementRef;
  constructor(
    private tempDataService: TempDataService,
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private log: LogService
  ) { }
  myControl: FormControl = new FormControl();

  clear() {
    let chargeValue = <Charge>{
      chargeId: 0,
      chargeName: '',
      chargeDescription: '',
      gateWayPercentage: 0,
      vendorPercentage: 0,
      tax: this.taxList,
    };
    this.selectedData = chargeValue;
  }

  ngOnInit() {
    this.header = <Header>{
      callingAPI: 'string',
      channel: 'admin',
      transactionId: UUID.UUID(),
    };
    this.headers = <Headers>{
      header: this.header,
    };
    this.getAllChargeDetail();
    this.getTaxes();

    this.log.info('EDIT METHOD');
    this.tempDataService.currentSelectedData.subscribe(
      (selectedData) => (this.selectedData = selectedData)
    );

    this.myControl = new FormControl({
      value: '',
      disabled: this.buttonStatus,
    });
    this.taxControl = new FormControl({
      value: '',
      disabled: this.buttonStatus,
    });
    for (let tax of this.selectedData.tax) {
      this.existingTaxes.push(tax);
    }
    this.log.info('EDIT METHOD=====' + JSON.stringify(this.selectedData));
    JSON.stringify(this.selectedData);
  }

  /* Save Details**/
  public saveDetail() {
    this.log.info('SAVE METHOD');
    debugger;
    if (this.chargeValidation() == true) {
      this.save(this.selectedData);
      this.router.navigate(['/charge']);

    } else {
      this.openSnackBar('Please fill the red marked fields', 'all field');
    }
  }
  private save(data: any) {
    let request = <ChargeRequest>{};
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

    this.restService
      .post(request, environment.updateChargePath)
      .map((charge: any) => {
        this.log.info('UPDATE****');
        let result: ChargeResponse;
        result = new ChargeResponse(
          charge.status['statusCode'],
          charge.status['statusDescription'],
          charge.status['transactionId']
        );
        return result;
      })
      .subscribe(
        (result) => {
          this.log.info(
            'inside response' +
            result.statusCode +
            '' +
            result.statusDescription +
            '' +
            result.transactionId
          );
          this.responseData = result;
          this.log.info(this.responseData);
          if (this.responseData.statusCode == '2001') {
            this.openSnackBar(
              'Successfully updated',
              this.selectedData.chargeName
            );
            this.log.info('--------------' + this.responseData.statusCode);
            this.getAllChargeDetail();
            this.router.routeReuseStrategy.shouldReuseRoute = () => false;
              this.router.onSameUrlNavigation = 'reload';
            this.router.navigate(['/charge']);
            this.ngOnInit();

          } else if (this.responseData.statusCode == '1002') {
            this.openSnackBar(
              this.responseData.statusDescription,
              this.selectedData.chargeName
            );
          } else if (this.responseData.statusCode == '4001') {
            this.openSnackBar(
             'Data already exist',
              this.selectedData.chargeName
            );
          }
        },
        (err) => {
          var errorVal = err.status.statusDescription;
          this.openSnackBar('ERROR MSG', errorVal);
        }
      );
  }


  private getAllChargeDetail(): any {
    debugger;
    this.restService
      .post(this.headers, environment.getAllChargePath)
      .map((response: any) => {
        let result: Array<Charge> = [];
        if (response) {
          response.charges.forEach((erg) => {
            let charge = new Charge(
              erg.chargeId,
              erg.chargeName,
              erg.chargeDescription,
              erg.chargeAmount,
              erg.gateWayPercentage,
              erg.vendorPercentage,
              erg.tax
            );
            let taxes: Array<Tax> = [];
            erg.taxes.forEach((obj) => {
              taxes.push(obj);
            });
            charge.tax = taxes;
            result.push(charge);
          });
        }
        return result;
      })
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }



  // Validation part

  validation() {
    if (this.selectedData.chargeName == '') {
      return 'charge_Name is required!';
    } else if (this.selectedData.chargeDescription == '') {
      return 'charge_description is required!';
    } else {
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

  Tax;
  /* Get Genre Details**/
  private getTaxes() {
    this.restService
      .post(this.headers, environment.getAllTaxPath)
      .map((allTaxes: Array<any>) => {
        if (allTaxes) {
          let taxesArray = allTaxes['taxes'];
          taxesArray.forEach((erg) => {
            this.ioObjArray = erg;
            this.result.push(
              new Tax(
                erg.taxId,
                erg.taxName,
                erg.taxDescription,
                erg.taxPercentage
              )
            );
          });
        }
        return this.result;
      })
      .subscribe((Taxes) => {
        this.result = Taxes;

        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
            this.router.onSameUrlNavigation = 'reload';


      });
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
  remove(taxObject: Tax): void {
    const index = this.existingTaxes.indexOf(taxObject);
    if (index >= 0) {
      this.taxIds.splice(index, 1);
      this.existingTaxes.splice(index, 1);
      this.selectedData.taxIds.splice(index, 1);
    }
  }
  debugger;
  selected(event: MatAutocompleteSelectedEvent): void {
    if (!(this.existingTaxes.indexOf(event.option.value) > -1)) {
      this.taxIds.push(event.option.viewValue);

      this.existingTaxes.push(event.option.value);
      this.selectedData.tax.push(event.option.value.taxId);
    }
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
