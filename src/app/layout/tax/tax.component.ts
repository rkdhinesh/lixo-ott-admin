import { Component, OnInit, ViewChild } from '@angular/core';
import { Tax } from './tax';
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
import { Header } from '../../shared/services/header';
import { LogService } from '../../shared/services/log.service';
import { environment } from '../../../environments/environment';
import { ScreenAccessService } from '../../shared/services/screen-access.service';

@Component({
  selector: 'app-tax',
  templateUrl: './tax.component.html',
  styleUrls: ['./tax.component.scss'],
})
export class TaxComponent implements OnInit {

  //Property Declaration
  headers: Headers;
  header = new Header(UUID.UUID());
  operationAccessMap = new Map();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = [
    'taxName',
    'taxDescription',
    'taxPercentage',
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
    public snackBar: MatSnackBar,
    public router: Router,
    public tempDataService: TempDataService,
    private screenAccess: ScreenAccessService,
  ) { }

  ngOnInit() {
    this.screenAccess.loadOperationsAccessForScreen('Tariff', 'Tax');
    this.operationAccessMap = this.screenAccess.map;
    this.getAllTaxDetail();   //call getAllTaxDetail() method to get already existing tax details
  }

  //Send selected genre detail
  editdata(data: any) {
    this.tempDataService.changeSelecedData(data);
  }

  //Delete clicked tax detail
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
    // Delete clicked tax by Id
    let deleteTax = <Tax>{
      taxId: data.taxId,
      header: this.header,
    };
    this.restService
      .delete(environment.deleteTaxPath + deleteTax.taxId)
      .map((response: any) => {            // get response from the end-point called
        let result: Array<Tax> = [];
        if (response.statusCode == 201) {  // Sucessful Delete
          this.openSnackBar(response.statusDescription, 'success-tax-snackbar', 'delete')      // show successful Deleted msg
          response.data.forEach((erg) => {
            result.push(
              new Tax(
                erg.taxId,
                erg.taxName,
                erg.taxDescription,
                erg.taxPercentage
              )
            );
          });
          return result;
        } else {
        }
      })
      .subscribe(
    );
  }

  openSnackBar(message: string, style: string, deleteTax?: string) {  // msg panel
    this.snackBar.open(message, '', {
      duration: 2000,           // show msg for 2 sec.
      panelClass: style
    });
    if (deleteTax) {
      setTimeout(() => {
        this.ngOnInit();
      }, 2000)           // route after 2 sec msg
    }
  }


  private getAllTaxDetail(): any {
    // Gets tax details from api end-point
    this.restService
      .get(environment.getAllTaxPath)
      .map((response: any) => {            // get data or response from the end-point called
        let result: Array<Tax> = [];
        if (response.statusCode == 201) {     // successful get
          response.data.forEach((erg) => {
            let tax = new Tax(
              erg.taxId,
              erg.taxName,
              erg.taxDescription,
              erg.taxPercentage
            );
            result.push(tax);
          });
          this.openSnackBar(response.statusDescription, 'success-tax-snackbar')  // show successful received msg
          this.isContent = true;
        }
        else if (response.statusCode == 204) {           //204 - no content
          this.noContent = true;
        }
        return result;
      })
      .subscribe((result) => {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      () => {
          this.isLoading = false;
      });
  }
}
