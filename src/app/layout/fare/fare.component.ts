import { Component, OnInit, ViewChild } from '@angular/core';
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
import { Fare } from './fare';
import { environment } from '../../../environments/environment';
import { LogService } from '../../shared/services/log.service';
import { Header } from '../../shared/services/header';
import { ScreenAccessService } from '../../shared/services/screen-access.service';

@Component({
  selector: 'app-fare',
  templateUrl: './fare.component.html',
  styleUrls: ['./fare.component.scss'],
})

export class FareComponent implements OnInit {

  //Propert Declaration
  headers: Headers;
  header = new Header(UUID.UUID());
  operationAccessMap = new Map();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = [
    'fareId',
    'amount',
    'taxes',
    'totalAmount',
    'action',
  ];
  deletedialogRef: any;
  noContent: boolean;
  isLoading: boolean = true;
  isContent: boolean = false;

  //Dependency Injection
  constructor(
    private restService: RestService,
    public dialog: MatDialog,
    public router: Router,
    public tempDataService: TempDataService,
    private screenAccess: ScreenAccessService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.screenAccess.loadOperationsAccessForScreen('Tariff', 'Fare');
    this.operationAccessMap = this.screenAccess.map;
    this.getAllFareDetail();   //call getAllFareDetail() method to get already existing fare details
  }

  //Send selected fare detail
  editdata(data: any) {
    this.tempDataService.changeSelecedData(data);
  }

  //Delete clicked fare detail
  delete(uniqueaccountType) {
    this.deletedialogRef = this.dialog.open(YesOrNoDialogComponent, {
      disableClose: true,
    });
    this.deletedialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteDetail(uniqueaccountType);
      } else {
      }
    });
    this.deletedialogRef.componentInstance.modal_name = 'DELETE ACCOUNT';
  }

  private deleteDetail(data: any) {
    // Delete clicked fare by Id
    let deleteFare = <Fare>{
      fareId: data.fareId,
      header: this.header,
    };
    this.restService
      .delete(environment.deleteFarePath + deleteFare.fareId)
      .map((response: any) => {            // get response from the end-point called
        if (response.statusCode == 201) {  // Sucessful Delete
          this.openSnackBar(response.statusDescription, 'success-fare-snackbar', 'delete')      // show successful Deleted msg
        }
      })
      .subscribe(
    );
  }
  openSnackBar(message: string, style: string, deleteFare?: string) {  // msg panel
    this.snackBar.open(message, '', {
      duration: 2000,           // show msg for 2 sec.
      panelClass: style,
    });
    if (deleteFare) {
      setTimeout(() => {
        this.ngOnInit();
      }, 2000)           // route after 2 sec msg
    }
  }

  private getAllFareDetail(): any {
    // Gets fare details from api end-point
    this.restService
      .get(environment.getAllFarePath)
      .map((response: any) => {            // get data or response from the end-point called
        let result: Array<Fare> = [];
        if (response.statusCode == 201) {     // successful get
          response.data.forEach((erg) => {
            let fare = new Fare(
              erg.fareId,
              erg.amount,
              erg.tax,
              erg.totalAmount,
              erg.taxIds
            );
            let taxes: Array<any> = [];
            if (erg.taxes) {
              erg.taxes.forEach((obj) => {
                taxes.push(obj);
              });
              fare.taxes = taxes;
            }
            fare.fareAmount =
              fare.baseFare + fare.extraFare - fare.discountFare;
            let charges: Array<any> = [];
            if (erg.charge) {
              erg.charge.forEach((obj) => {
                charges.push(obj);
              });
              fare.charges = charges;
            }
            result.push(fare);
          });
          this.openSnackBar(response.statusDescription, 'success-fare-snackbar')  // show successful received msg
          this.isContent = true;
        }
        else if (response.statusCode == 204) {           //204 - no content
          this.noContent = true;
        }
        return result;
      })
      .subscribe(
        (result) => {
          this.dataSource = new MatTableDataSource(result);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        },
        () => {
            this.isLoading = false;
        }
      );
  }
}
