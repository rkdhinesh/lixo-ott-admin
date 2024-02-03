import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Fare } from '../fare';
import { FareResponse } from '../fareResponse';
import { Header } from '../../../shared/services/header';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { UUID } from '../../../shared/services/uuid';
import { Headers } from '../../../shared/model/request-header';
import { TempDataService } from '../../../shared/temp-dataStore';
import { Charge } from '../../charge/charge';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Tax } from '../../tax/tax';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-view-fare',
  templateUrl: './view-fare.component.html',
  styleUrls: ['./view-fare.component.scss']
})
export class ViewFareComponent implements OnInit {

  //property declaration
  selectedData: Fare;

  //dependency injection
  constructor(
    private tempDataService: TempDataService
) { }

  ngOnInit() {
    this.tempDataService.currentSelectedData.subscribe(   // get clicked fare details here
      selectedData => this.selectedData = selectedData
      );
  }

}



