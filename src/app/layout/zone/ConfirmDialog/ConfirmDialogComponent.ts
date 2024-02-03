import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Zone } from '../zone';
import { TempDataService } from '../../../shared/temp-dataStore';
import { Router } from '@angular/router';
import { LogService } from '../../../shared/services/log.service';

@Component({
  selector: 'ConfirmDialogComponent',
  templateUrl: 'ConfirmDialogComponent.html',
})

export class ConfirmDialogComponent implements OnInit {
  uniqueaccountType: any;
  selectedData: Zone;
  constructor(public dialog: MatDialog, public router: Router,
    public tempDataService: TempDataService, public snackBar: MatSnackBar, private log: LogService) { }

  ngOnInit() {
    debugger;
    this.log.info("Confirm Component.ts");
    this.tempDataService.currentSelectedData.subscribe(selectedData => this.selectedData = selectedData);
  }
}