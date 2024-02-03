import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ScreenModel } from '../../../shared/model/screen-model';
import { TempDataService } from '../../../shared/temp-dataStore';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips'
import { RestService } from '../../../api.service';
import { FormControl, Validators } from '@angular/forms';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Header } from '../../../shared/services/header';
import { UUID } from '../../../shared/services/uuid';
import { LogService } from '../../../shared/services/log.service';
import { environment } from '../../../../environments/environment';
import { Status } from '../../../shared/model/response-status-model';

@Component({
  selector: 'app-edit-screen',
  templateUrl: './edit-screen.component.html',
  styleUrls: ['./edit-screen.component.scss']
})
export class EditScreenComponent implements OnInit {

  selectedData: ScreenModel;
  isScreenPage: boolean = true;

  screenFormControl = new FormControl('', Validators.required);

  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;
  separatorKeysCodes = [ENTER, COMMA];
  alphabets: string[] = [];
  showFormControl = new FormControl();
  filteredShows: Observable<any[]>;

  showTimes: string[] = [];
  day: number = 24*60;
  allShowTimes: string[] = [];

  rowTypes = [
    { value: "Alphabets", viewValue: "Alphabets" },
    { value: "Numbers", viewValue: "Numbers" }
  ];

  rowOrders = [
    { value: "Left to Right", viewValue: "Left to Right" },
    { value: "Right to Left", viewValue: "Right to Left" }
  ];
  coloumnOrders = [
    { value: "Top to Bottom", viewValue: "Top to Bottom" },
    { value: "Bottom to Top", viewValue: "Bottom to Top" }
  ];

  @ViewChild('showTimeInput') showTimeInput: ElementRef;

  constructor(private tempDataService: TempDataService,
    private restService: RestService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {
      for (let i=0; i< this.day; i++) {
        var hh = Math.floor(i/60);
        var mm = (i%60);
        this.allShowTimes[i] = ("0" + (hh % 24)).slice(-2) + ':' + ("0" + mm).slice(-2);
        i = i + 4;
      }
    this.filteredShows = this.showFormControl.valueChanges.pipe(
      startWith(null),
      map((showTime: string | null) => showTime ? this.filter(showTime) : this.allShowTimes.slice()));

  }


  ngOnInit() {
    this.tempDataService.currentSelectedData.subscribe(selectedData => this.selectedData = selectedData);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our showTime
    if ((value || '').trim()) {
      this.showTimes.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.showFormControl.setValue(null);
  }

  remove(showTime: any): void {
    const index = this.showTimes.indexOf(showTime);

    if (index >= 0) {
      this.showTimes.splice(index, 1);
    }
  }

  filter(name: string) {
    return this.allShowTimes.filter(showTime =>
      showTime.toLowerCase().indexOf(name.toLowerCase()) === 0);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.showTimes.push(event.option.viewValue);
    this.showTimeInput.nativeElement.value = '';
    this.showFormControl.setValue(null);
  }

  public saveScreenDetail() {
    this.log.info("SAVE METHOD");

    let validationMessage = this.validation();
    if (validationMessage == false) {
      this.saveScreen();
    } else {
      this.openSnackBar("Please fill the red marked fields", validationMessage);
    }
  }

  private saveScreen() {

    let header = new Header( UUID.UUID());
    this.selectedData.header = header;
    this.selectedData.defaultShowTimes = this.showTimes;
    this.selectedData.active = 0;
    if (this.selectedData.live == true) {
      this.selectedData.active = 1;
    }

    this.restService.post(this.selectedData, environment.updateScreenPath)
      .map((screen: any) => {
        this.log.info("SAVE****");
        let result = new Status(screen.status["statusCode"], screen.status["statusDescription"],
          screen.status["transactionId"]);
        result.id = screen.status["id"];
        return result;

      })
      .subscribe(result => {
        this.selectedData.screenId = Number(result.id);
        this.openSnackBar(this.selectedData.screenName, "Saved Successfully");
        this.router.navigate(['/screen', { venueId: this.selectedData.venueId }]);
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  validation() {
    if (this.selectedData.venueId == null) {
      return 'Venue is required!';
    } else if (this.selectedData.screenName == null || this.selectedData.screenName == '') {
      return 'Screen Name is required!';
    } else if (this.showTimes.length == 0) {
      return 'Show Times is required!';
    } else {
      return false;
    }
  }

  public editScreenCancel() {

    this.router.navigate(['/screen', { venueId: this.selectedData.venueId }]);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}

