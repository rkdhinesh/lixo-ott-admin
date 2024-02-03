import { Component, OnInit } from '@angular/core';
import { Tax } from '../tax';
import { TaxResponse } from '../taxResponse';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { Headers } from '../../../shared/model/request-header';
import { UUID } from '../../../shared/services/uuid';
import { Header } from '../../../shared/services/header';
import { LogService } from '../../../shared/services/log.service';


@Component({
  selector: 'app-view-tax',
  templateUrl: './view-tax.component.html',
  styleUrls: ['./view-tax.component.scss']
})
export class ViewTaxComponent implements OnInit {

  //property declaration
  selectedData: Tax;

  //dependency injection
  constructor(
    private tempDataService: TempDataService) { }

  ngOnInit() {
    this.tempDataService.currentSelectedData.subscribe(   // get clicked tax details here
      selectedData => this.selectedData = selectedData
      );
  }

}