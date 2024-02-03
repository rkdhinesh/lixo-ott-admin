import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LogService } from '../../services/log.service';
import { YesOrNoDialogComponent } from '../../components/YesOrNoDialogs/YesOrNoDialogComponent';
import { TempDataService } from '../../temp-dataStore';

@Component({
  selector: 'app-lixo-data-table',
  templateUrl: './lixo-data-table.component.html',
  styleUrls: ['./lixo-data-table.component.scss']
})
export class LixoDataTableComponent implements OnInit {

  @Input() tableData;
  @Input() columnHeader;
  @Input() lixoDataTableModel;
  objectKeys = Object.keys;
  dataSource: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dialogRef: any;
  deletedialogRef: any;

  @Output() itemSelectedEmitter = new EventEmitter();

  ngOnInit() {
    this.log.info('Table Data :: ' + this.tableData);
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

  }
  constructor(
    public dialog: MatDialog, public router: Router,
    public tempDataService: TempDataService, public snackBar: MatSnackBar,
    private log: LogService) { }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  /* Edit Details **/
  editdata(data: any) {
    this.log.info("DATA=====" + JSON.stringify(data));
    data.editable = true;
    this.tempDataService.changeSelecedData(data);
    return true;
  }


 delete (data: any) {
    if(!data.active){
      this.openSnackBar(data.companyName,"Company is Disabled")
    }else{


    this.deletedialogRef = this.dialog.open(YesOrNoDialogComponent, {

      disableClose: true
    });
    this.deletedialogRef.afterClosed().subscribe(result => {

      this.log.info(result);
      if (result === true) {
        this.deleteDetail(data);
      }
    });
    this.deletedialogRef.componentInstance.modal_name = "DELETE ACCOUNT"
  }
  }
  private deleteDetail(data: any) {
    this.itemSelectedEmitter.emit(data);
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}


