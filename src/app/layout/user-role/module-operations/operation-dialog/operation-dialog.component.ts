import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Operation } from '../../../../shared/model/operation';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  moduleName: string;
  subModuleName: string;
  operationName: string;
  operationDescription: string;
  operations: Operation[];
}

@Component({
  selector: 'app-operation-dialog',
  templateUrl: './operation-dialog.component.html',
  styleUrls: ['./operation-dialog.component.scss']
})
export class OperationDialogComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['name', 'description', 'action'];

  constructor(
    public dialogRef: MatDialogRef<OperationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public deleteItem(operation: Operation) {
    const index: number = this.data.operations.indexOf(operation);
    if (index !== -1) {
      this.data.operations.splice(index, 1);
    }
    this.dataSource = new MatTableDataSource(this.data.operations);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  public addOperationNameList() {
    let operation = new Operation();
    operation.operationName = this.data.operationName;
    operation.operationDescription = this.data.operationDescription;
    this.data.operations.push(operation);

    this.dataSource = new MatTableDataSource(this.data.operations);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.data.operationName = '';
    this.data.operationDescription = '';

  }

  ngOnInit() {
    this.data.operations = [];
  }
}
