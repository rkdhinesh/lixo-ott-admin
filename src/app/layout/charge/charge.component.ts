import { Component, OnInit, ViewChild } from '@angular/core';
import { Charge } from './charge';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TempDataService } from '../../shared/temp-dataStore';
import { Headers } from '../../shared/model/request-header';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { UUID } from '../../shared/services/uuid';
import { RestService } from '../../api.service';
import { environment } from '../../../environments/environment';
import { LogService } from '../../shared/services/log.service';
import { Header } from '../../shared/services/header';
import { Tax } from './tax';
import { ScreenAccessService } from '../../shared/services/screen-access.service';

@Component({
  selector: 'app-charge',
  templateUrl: './charge.component.html',
  styleUrls: ['./charge.component.scss'],
})
export class ChargeComponent implements OnInit {
  ioObjArray: Charge[] = [];
  selectedData: Charge;
  headers: Headers;
  header = new Header(UUID.UUID());
  errorMessage: string = '';

  isDeleteValid: Boolean = false;

  isLoading: boolean = true;
  queryString: string = '';
  selectedOption: string;
  closeResult: string;
  data: any;
  operationAccessMap = new Map();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = [
    'chargeName',
    'chargeAmount',
    'gateWayPercentage',
    'vendorPercentage',
    'tax',
    'action',
  ];
  color = 'primary';
  mode = 'determinate';
  FormObj;
  pageEvent: PageEvent;
  dialogRef;
  deletedialogRef;

  constructor(
    private restService: RestService,
    public dialog: MatDialog,
    public router: Router,
    public tempDataService: TempDataService,
    private screenAccess: ScreenAccessService,
    private log: LogService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.headers = <Headers>{
      header: this.header,
    };
    this.screenAccess.loadOperationsAccessForScreen('Tariff', 'Charge');
    this.operationAccessMap = this.screenAccess.map;
    this.getAllChargeDetail();
  }

  /* Edit Details **/
  editdata(data: any) {
    this.log.info('DATA=====' + JSON.stringify(data));
    this.log.info(JSON.stringify(data));
    this.log.info('setting to datastore');
    //data.editable = false;
    this.tempDataService.changeSelecedData(data);

    return true;
  }

  /* view Details **/
  viewDetailsdata(data: any) {
    this.log.info('DATA=====' + JSON.stringify(data));
    this.log.info(JSON.stringify(data));
    this.log.info('setting to datastore');
    data.editable = true;
    this.tempDataService.changeSelecedData(data);
    return true;
  }

  /* Delete details**/

  delete(uniqueaccountType) {
    this.deletedialogRef = this.dialog.open(YesOrNoDialogComponent, {
      disableClose: true,
    });
    this.deletedialogRef.afterClosed().subscribe((result) => {
      this.log.info('after closed:result');
      this.log.info(result);
      if (result === true) {
        this.deleteDetail(uniqueaccountType);
      } else {
      }
    });
    this.deletedialogRef.componentInstance.modal_name = 'DELETE ACCOUNT';
  }

  private deleteDetail(data: any) {
    let deleteCharge = <Charge>{
      chargeId: data.chargeId,
      header: this.header,
    };
    // data.header=this.headervalue;
    this.log.info('Delete Method' + JSON.stringify(data));

    this.restService
      .post(deleteCharge, environment.deleteChargePath)
      .map((charge: any) => {
        let result: Array<Charge> = [];
        if (charge instanceof Array) {
          charge.forEach((erg) => {
            this.log.info('Delete===');
            result.push(
              new Charge(
                erg.chargeId,
                erg.chargeName,
                erg.chargeDescription,
                erg.chargeAmount,
                erg.gateWayPercentage,
                erg.vendorPercentage,
                erg.tax
              )
            );
          });
          return result;
        } else {
          this.log.info('===============' + charge.status.statusCode);
          if (charge.status.statusCode == '3001') {
            this.getAllChargeDetail();
            this.log.info('--------------' + charge.status.statusCode);
          } else if (charge.status.statusCode == '1002') {
            this.openSnackBar(
              charge.status.statusDescription,
              this.selectedData.chargeName
            );
          }
        }
      })
      .subscribe((venuecatogries) => (this.ioObjArray = venuecatogries));
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  /* Get Details**/
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
}
