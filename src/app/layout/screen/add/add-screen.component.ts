import { Component, OnInit, ElementRef, ViewChild, Input, AfterViewInit } from '@angular/core';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Header } from '../../../shared/services/header';
import { Headers } from '../../../shared/model/request-header';
import { Observable } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { map, skip, startWith } from 'rxjs/operators';
import { ScreenModel } from '../../../shared/model/screen-model';
import { UUID } from '../../../shared/services/uuid';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { ClassModel } from '../../../shared/model/class-model';
import { SeatLayoutModel } from '../../../shared/model/seat-layout-model';
import { ColumnModel } from '../../../shared/model/column-model';
import { LogService } from '../../../shared/services/log.service';
import { Venue } from '../../venue/venue';
import { Status } from '../../../shared/model/response-status-model';
import { environment } from '../../../../environments/environment';


export class AddClassesRequest {
  header: Header;
  classes: ClassModel[] = [];
  constructor() { }
}
export class DropDownModel {
  id: number;
  name: any;
  constructor(id: number, name: any) {
    this.id = id;
    this.name = name;
  }
}
export class RequestHeader {
  header: Header;
  constructor() { }
}
@Component({
  selector: 'app-add-screen',
  templateUrl: './add-screen.component.html',
  styleUrls: ['./add-screen.component.scss']
})
export class AddScreenComponent implements OnInit {

  headers: Headers;
  header = new Header(UUID.UUID());
  experienceList: DropDownModel[] = [];
  selectedExperience: number;
  selectedData: ScreenModel;
  isSeatLayoutScreen: boolean = false;
  isSeatLayoutPreviewScreen: boolean = false;
  isScreenPage: boolean = true;
  fareList: DropDownModel[] = [];
  selectedFare: DropDownModel;
  screenFormControl = new FormControl('', Validators.required);
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = false;
  separatorKeysCodes = [ENTER, COMMA];
  alphabets: string[] = [];
  showFormControl = new FormControl();
  filteredShows: Observable<any[]>;
  selectedfareId: any;
  selectedfareName: any;
  showTimes: string[] = [];
  skipRow: number = 1;
  day: number = 24 * 12;
  allShowTimes: string[] = [];


  rowTypeFormControl = new FormControl();
  rowTypes = [
    { value: "Alphabets", viewValue: "Alphabets" },
    { value: "Numbers", viewValue: "Numbers" }
  ];

  rowOrderFormControl = new FormControl();
  columnOrderFormControl = new FormControl();
  rowOrders = [
    { value: "Left to Right", viewValue: "Left to Right" },
    { value: "Right to Left", viewValue: "Right to Left" }
  ];
  coloumnOrders = [
    { value: "Top to Bottom", viewValue: "Top to Bottom" },
    { value: "Bottom to Top", viewValue: "Bottom to Top" }
  ];


  @ViewChild('showTimeInput') showTimeInput: ElementRef;

  constructor(private restService: RestService,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {
    let c = 0;
    this.allShowTimes = [];
    for (let i = 0; i < this.day; i++) {
      var hh = Math.floor(c / 60);
      var mm = (c % 60);
      this.allShowTimes[i] = ("0" + (hh % 24)).slice(-2) + ':' + ("0" + mm).slice(-2);
      c = c + 5;
    }
    this.filteredShows = this.showFormControl.valueChanges.pipe(
      startWith(null),
      map((showTime: string | null) => showTime ? this.filter(showTime) : this.allShowTimes.slice()));
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
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

  ngOnInit() {
    this.headers = <Headers>{
      header: this.header
    }
    let venue: Venue = JSON.parse(localStorage.getItem('venue'));

    let venueId = venue.venueId;

    let screen = <ScreenModel>({
      screenName: '', synopsis: '',
      dimension: '', live: true
    });
    screen.venueId = Number(venueId);
    this.selectedData = screen;

    var i = 'A'.charCodeAt(0);
    var loopEnd = 'Z'.charCodeAt(0);
    let x = 0;

    for (i; i <= loopEnd; i++) {
      this.alphabets[x] = String.fromCharCode(i);
      x++;
    }
    this.getAllExperience();
  }

  getAllExperience() {

    this.restService.post(this.headers, environment.getAllExperience)
      .map((experience: any) => {
        if (experience) {
          experience.experiences.forEach(erg => {
            this.experienceList.push(new DropDownModel(erg.experienceId,
              erg.experienceName));
          });
        }
      })
      .subscribe(result => { },
        err => { });
  }

  public saveClassesAndSeatLayoutTemplate() {
    this.saveClasses();
    this.openSnackBar('', "Saved Successfully");
    this.router.navigate(['/venue']);
  }


  public saveClasses() {
    let header = new Header(UUID.UUID());
    let request = new AddClassesRequest();
    request.header = header;
    request.classes = this.selectedData.classes;

    this.restService.post(request, environment.addClassesAndSeatsPath)
      .map((screen: any) => {
        this.log.info("Class and seat Layout saved successfully...");
        return new Status(screen.status["statusCode"], screen.status["statusDescription"],
          screen.status["transactionId"]);
      })
      .subscribe(result => {

      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  public saveSeatLayout() {
    this.log.info('saveSeatLayout method called...');
    for (let i = 0; i < this.selectedData.classes.length; i++) {
      let header = new Header(UUID.UUID());
      this.selectedData.classes[i].header = header;
      this.selectedData.classes[i].classId = 41;
      this.restService.post(this.selectedData.classes[i], environment.addScreenLayoutToClassPath)
        .map((screen: any) => {
          this.log.info("seat Layout saved successfully...");
          return new Status(screen.status["statusCode"], screen.status["statusDescription"],
            screen.status["transactionId"]);
        })
        .subscribe(result => {

        }, err => {
          var errorVal = err.status.statusDescription;
          this.openSnackBar("ERROR MSG", errorVal)
        });
    }
  }

  public preview() {
    this.log.info(JSON.stringify(this.selectedData.classes));
    this.isSeatLayoutPreviewScreen = true;
    this.isSeatLayoutScreen = false;
    this.isScreenPage = false;
  }

  public back() {
    this.isSeatLayoutPreviewScreen = false;
    this.isSeatLayoutScreen = true;
    this.isScreenPage = false;
  }

  public onColumnSeatNumberColumnReferenceChange(column: ColumnModel, classModel: ClassModel,
    coOrdinateX: number, coOrdinateY: number, columnReference: number) {
    console.log("~~~~~~~~~~~~~~~~~~seat number");
    let counter: number = columnReference;
    for (let colSNo = column.tableSequenceId; colSNo < classModel.columnsList.length; colSNo++) {
      for (let j = 0; j < classModel.seats.length; j++) {
        if (classModel.seats[j].coOrdinateX == coOrdinateX && classModel.seats[j].coOrdinateY == colSNo) {
          if (classModel.seats[j].seat == true) {
            let tempSeatNumber = classModel.seats[j].tempSeatNumber.split("-");
            classModel.seats[j].rowReference = tempSeatNumber[0];
            classModel.seats[j].rowLabel = classModel.seats[j].rowReference;
            classModel.seats[j].columnReference = counter;
            classModel.seats[j].seatNumber = classModel.seats[j].rowReference + classModel.seats[j].columnReference;
            classModel.seats[j].inputDisabled = false;
            classModel.seats[j].bookingStatus = "AVAILABLE";
            counter++;
          } else {
            classModel.seats[j].rowReference = "";
            let tempSeatNumber = classModel.seats[j].tempSeatNumber.split("-");
            classModel.seats[j].rowLabel = tempSeatNumber[0];
            classModel.seats[j].columnReference = null;
            classModel.seats[j].seatNumber = "";
            classModel.seats[j].inputDisabled = true;
            classModel.seats[j].bookingStatus = "AVAILABLE";
          }
        }
      }
    }

  }
  public onColumnChange(classModel: ClassModel,
    coOrdinateX: number, coOrdinateY: number, seatSelectionFlag: boolean) {
    let skipcolumn: number = 0;
    for (let i = 0; i < classModel.columnsList.length; i++) {
      if (classModel.columnsList[i].checkBoxSelection == false) {
        skipcolumn++;
      }
    }

    if (this.selectedData.rowOrder == "Right to Left") {
      let counter: number = classModel.columnsList.length - skipcolumn;
      for (let i = 0; i < classModel.columnsList.length; i++) {
        for (let j = 0; j < classModel.seats.length; j++) {
          let tempSeatNumber = classModel.seats[j].tempSeatNumber.split("-");
          classModel.seats[j].rowLabel = tempSeatNumber[0];
          classModel.seats[j].bookingStatus = "AVAILABLE";
          if (classModel.seats[j].coOrdinateX == coOrdinateX && classModel.seats[j].coOrdinateY == coOrdinateY && classModel.seats[j].coOrdinateY == i && seatSelectionFlag == false) {
            counter--;
            classModel.seats[j].rowReference = "";
            classModel.seats[j].columnReference = null;
            classModel.seats[j].seatNumber = "";
            classModel.seats[j].inputDisabled = true;
          }
          else if (classModel.seats[j].coOrdinateX == coOrdinateX && classModel.seats[j].coOrdinateY == coOrdinateY && classModel.seats[j].coOrdinateY == i && seatSelectionFlag == true) {
            classModel.seats[j].rowReference = tempSeatNumber[0];
            classModel.seats[j].columnReference = counter;
            classModel.seats[j].seatNumber = classModel.seats[j].rowReference + classModel.seats[j].columnReference;
            classModel.seats[j].inputDisabled = false;
            classModel.columnsList[i].tableSequenceName = classModel.seats[j].columnReference + "";
            counter--;
          }
          else if (classModel.seats[j].coOrdinateX == coOrdinateX && classModel.seats[j].coOrdinateY == i) {
            if (classModel.seats[j].seat == true) {
              classModel.seats[j].rowReference = tempSeatNumber[0];
              classModel.seats[j].columnReference = counter;
              classModel.seats[j].seatNumber = classModel.seats[j].rowReference + classModel.seats[j].columnReference;
              classModel.seats[j].inputDisabled = false;
              classModel.columnsList[i].tableSequenceName = classModel.seats[j].columnReference + "";
              counter--;
            } else {
              classModel.seats[j].rowReference = "";
              classModel.seats[j].columnReference = null;
              classModel.seats[j].seatNumber = "";
              classModel.seats[j].inputDisabled = true;
            }
          }
        }
      }
    }
    else {
      let counter: number = 0;
      for (let i = 0; i < classModel.columnsList.length; i++) {
        for (let j = 0; j < classModel.seats.length; j++) {
          let tempSeatNumber = classModel.seats[j].tempSeatNumber.split("-");
          classModel.seats[j].rowLabel = tempSeatNumber[0];
          classModel.seats[j].bookingStatus = "AVAILABLE";
          if (classModel.seats[j].coOrdinateX == coOrdinateX && classModel.seats[j].coOrdinateY == coOrdinateY && classModel.seats[j].coOrdinateY == i && seatSelectionFlag == false) {
            counter++;
            classModel.seats[j].rowReference = "";
            classModel.seats[j].columnReference = null;
            classModel.seats[j].seatNumber = "";
            classModel.seats[j].inputDisabled = true;
          }
          else if (classModel.seats[j].coOrdinateX == coOrdinateX && classModel.seats[j].coOrdinateY == coOrdinateY && classModel.seats[j].coOrdinateY == i && seatSelectionFlag == true) {
            classModel.seats[j].rowReference = tempSeatNumber[0];
            classModel.seats[j].columnReference = counter + 1;
            classModel.seats[j].seatNumber = classModel.seats[j].rowReference + classModel.seats[j].columnReference;
            classModel.seats[j].inputDisabled = false;
            classModel.columnsList[i].tableSequenceName = classModel.seats[j].columnReference + "";
            counter++;
          }
          else if (classModel.seats[j].coOrdinateX == coOrdinateX && classModel.seats[j].coOrdinateY == i) {
            if (classModel.seats[j].seat == true) {
              classModel.seats[j].rowReference = tempSeatNumber[0];
              classModel.seats[j].columnReference = counter + 1;
              classModel.seats[j].seatNumber = classModel.seats[j].rowReference + classModel.seats[j].columnReference;
              classModel.seats[j].inputDisabled = false;
              classModel.columnsList[i].tableSequenceName = classModel.seats[j].columnReference + "";
              counter++;
            }
            else {
              classModel.seats[j].rowReference = "";
              classModel.seats[j].columnReference = null;
              classModel.seats[j].seatNumber = "";
              classModel.seats[j].inputDisabled = true;
            }
          }
        }
      }
    }
  }

  public onColumnSelectAllChange(column: ColumnModel, classModel: ClassModel) {
    // based on the column number and class need to select all the column
    for (let i = 0; i < classModel.seats.length; i++) {
      if (classModel.seats[i].coOrdinateY == column.tableSequenceId) {
        if (column.checkBoxSelection == true) {
          classModel.seats[i].seat = true;
        } else {
          classModel.seats[i].seat = false;
        }
      }
    }


    if (column.checkBoxSelection == false) {
      column.tableSequenceName = "";
    }

    let counterArrayFlag: boolean[] = [];
    let counterArray: number[] = [];
    for (let i = 0; i < classModel.columnsList.length; i++) {
      counterArrayFlag[i] = false;
    }

    let skipcolumn: number = 0;
    for (let i = 0; i < classModel.columnsList.length; i++) {
      if (classModel.columnsList[i].checkBoxSelection == false) {
        skipcolumn++;
      }
    }

    if (this.selectedData.rowOrder == "Right to Left") {
      let counter: number = classModel.columnsList.length - skipcolumn;
      for (let i = 0; i < classModel.columnsList.length; i++) {
        for (let j = 0; j < classModel.seats.length; j++) {
          let tempSeatNumber = classModel.seats[j].tempSeatNumber.split("-");
          classModel.seats[j].rowLabel = tempSeatNumber[0];
          classModel.seats[j].bookingStatus = "AVAILABLE";
          if (classModel.seats[j].coOrdinateY == i) {
            if (classModel.seats[j].seat == true) {
              classModel.seats[j].inputDisabled = false;
              classModel.seats[j].checkBoxDisabled = false;
              classModel.seats[j].rowReference = tempSeatNumber[0];
              if (counterArrayFlag[i] == false) {
                classModel.seats[j].columnReference = counter;
                classModel.seats[j].seatNumber = classModel.seats[j].rowReference + classModel.seats[j].columnReference;
                classModel.columnsList[i].tableSequenceName = classModel.seats[j].columnReference + "";
                counterArray[i] = counter;
                counter--;
                counterArrayFlag[i] = true;
              } else {
                classModel.seats[j].columnReference = counterArray[i];
                classModel.seats[j].seatNumber =
                  classModel.seats[j].rowReference +
                  classModel.seats[j].columnReference;
              }
            } else {
              classModel.seats[j].seatNumber = "";
              classModel.seats[j].columnReference = null;
              classModel.seats[j].rowReference = null;
              classModel.seats[j].inputDisabled = true;
              if (column.checkBoxSelection == false) {
                classModel.seats[j].checkBoxDisabled = true;
              }
            }
          }
        }
      }
    }
    else {
      let counter: number = 0;
      for (let i = 0; i < classModel.columnsList.length; i++) {
        for (let j = 0; j < classModel.seats.length; j++) {
          let tempSeatNumber = classModel.seats[j].tempSeatNumber.split("-");
          classModel.seats[j].rowLabel = tempSeatNumber[0];
          classModel.seats[j].bookingStatus = "AVAILABLE";
          if (classModel.seats[j].coOrdinateY == i) {
            if (classModel.seats[j].seat == true) {
              classModel.seats[j].inputDisabled = false;
              classModel.seats[j].checkBoxDisabled = false;
              classModel.seats[j].rowReference = tempSeatNumber[0];
              if (counterArrayFlag[i] == false) {
                classModel.seats[j].columnReference = counter + 1;
                classModel.seats[j].seatNumber = classModel.seats[j].rowReference + classModel.seats[j].columnReference;
                classModel.columnsList[i].tableSequenceName = classModel.seats[j].columnReference + "";
                counterArray[i] = counter;
                counter++;
                counterArrayFlag[i] = true;
              } else {
                classModel.seats[j].columnReference = counterArray[i] + 1;
                classModel.seats[j].seatNumber =
                  classModel.seats[j].rowReference +
                  classModel.seats[j].columnReference;
              }
            } else {
              classModel.seats[j].seatNumber = "";
              classModel.seats[j].columnReference = null;
              classModel.seats[j].rowReference = null;
              classModel.seats[j].inputDisabled = true;
              if (column.checkBoxSelection == false) {
                classModel.seats[j].checkBoxDisabled = true;
              }
            }
          }
        }
      }
    }
  }
  public addColumnForClass(classModel: ClassModel, classNumber: number) {

    let columnMaxLength: number = this.selectedData.classes[classNumber].columnsList.length;
    this.selectedData.classes[classNumber].columnsList.push(new ColumnModel(columnMaxLength, (columnMaxLength + 1) + '', true));

    for (let k = 0; k < this.selectedData.classes[classNumber].rowRefList.length; k++) {
      let seatLayoutModel = this.convertSeatLayoutModel(k, columnMaxLength,
        this.selectedData.classes[classNumber].rowRefList[k].tableSequenceName, columnMaxLength);
      if (this.selectedData.classes[classNumber].rowRefList[k].tableSequenceName == "") {
        seatLayoutModel.seat = false;
        seatLayoutModel.columnReference = null;
        seatLayoutModel.rowReference = "";
      }
      this.selectedData.classes[classNumber].seats.push(seatLayoutModel);
    }

    let counterArrayFlag: boolean[] = [];
    let counterArray: number[] = [];
    for (let i = 0; i < classModel.columnsList.length; i++) {
      counterArrayFlag[i] = false;
    }

    let skipcolumn: number = 0;
    for (let i = 0; i < classModel.columnsList.length; i++) {
      if (classModel.columnsList[i].checkBoxSelection == false) {
        skipcolumn++;
      }
    }

    if (this.selectedData.rowOrder == "Right to Left") {
      let counter: number = classModel.columnsList.length - skipcolumn;
      for (let i = 0; i < classModel.columnsList.length; i++) {
        for (let j = 0; j < classModel.seats.length; j++) {
          let tempSeatNumber = classModel.seats[j].tempSeatNumber.split("-");
          classModel.seats[j].rowLabel = tempSeatNumber[0];
          classModel.seats[j].bookingStatus = "AVAILABLE";
          if (classModel.seats[j].coOrdinateY == i) {
            if (classModel.seats[j].seat == true) {
              classModel.seats[j].inputDisabled = false;
              classModel.seats[j].checkBoxDisabled = false;
              classModel.seats[j].rowReference = tempSeatNumber[0];
              if (counterArrayFlag[i] == false) {
                classModel.seats[j].columnReference = counter;
                classModel.seats[j].seatNumber = classModel.seats[j].rowReference + classModel.seats[j].columnReference;
                classModel.columnsList[i].tableSequenceName = classModel.seats[j].columnReference + "";
                counterArray[i] = counter;
                counter--;
                counterArrayFlag[i] = true;
              } else {
                // let seatNo: number = counterArray[i];
                classModel.seats[j].columnReference = counterArray[i];
                classModel.seats[j].seatNumber = classModel.seats[j].rowReference + classModel.seats[j].columnReference;
              }
            }
          }
        }
      }
    }
    else {
      let counter: number = 0;
      for (let i = 0; i < classModel.columnsList.length; i++) {
        for (let j = 0; j < classModel.seats.length; j++) {
          let tempSeatNumber = classModel.seats[j].tempSeatNumber.split("-");
          classModel.seats[j].rowLabel = tempSeatNumber[0];
          classModel.seats[j].bookingStatus = "AVAILABLE";
          if (classModel.seats[j].coOrdinateY == i) {
            if (classModel.seats[j].seat == true) {
              classModel.seats[j].inputDisabled = false;
              classModel.seats[j].checkBoxDisabled = false;
              classModel.seats[j].rowReference = tempSeatNumber[0];
              if (counterArrayFlag[i] == false) {
                classModel.seats[j].columnReference = counter + 1;
                classModel.seats[j].seatNumber = classModel.seats[j].rowReference + classModel.seats[j].columnReference;
                classModel.columnsList[i].tableSequenceName = classModel.seats[j].columnReference + "";
                counterArray[i] = counter;
                counter++;
                counterArrayFlag[i] = true;
              } else {
                // let seatNo: number = counterArray[i] + 1;
                classModel.seats[j].columnReference = counterArray[i] + 1
                classModel.seats[j].seatNumber = classModel.seats[j].rowReference + classModel.seats[j].columnReference;
              }
            }
          }
        }
      }
    }
  }
  public addRowForClass(classModel: ClassModel, classNumber: number) {
    debugger;
    let rowMaxLength: number = this.selectedData.classes[classNumber].rowRefList.length;
    this.selectedData.classes[classNumber].rowRefList.push(new ColumnModel(rowMaxLength, (rowMaxLength + 1) + '', true));


    for (let k = 0; k < this.selectedData.classes[classNumber].columnsList.length; k++) {
      let seatLayoutModel = this.convertSeatLayoutModel(rowMaxLength, k,
        this.selectedData.classes[classNumber].columnsList[k].tableSequenceName, k);
      if (this.selectedData.classes[classNumber].columnsList[k].tableSequenceName == "") {
        seatLayoutModel.seat = false;
        seatLayoutModel.columnReference = null;
        seatLayoutModel.rowReference = "";
      }
      this.selectedData.classes[classNumber].seats.push(seatLayoutModel);
    }


    let skiprow: number = 1;
    for (let k = 0; k < this.selectedData.classes.length; k++) {
      for (let i = 0; i < this.selectedData.classes[k].rowRefList.length; i++) {
        if (this.selectedData.classes[k].rowRefList[i].checkBoxSelection == false) {
          skiprow++;
        }
      }
    }

    let skipcolumn: number = 0;
    for (let i = 0; i < this.selectedData.classes[classNumber].columnsList.length; i++) {
      if (this.selectedData.classes[classNumber].columnsList[i].checkBoxSelection == false) {
        skipcolumn++;
      }
    }

    if (this.selectedData.columnOrder == "Top to Bottom") {
      // Top-Bottom seat Arrangement
      // let classAlphabets: string[] = [];
      let alphabetCount = 0;
      let totalAlphabetCount = 25;

      for (let i = 0; i < this.selectedData.classes.length; i++) {
        alphabetCount += this.selectedData.classes[i].rowRefList.length;
      }

      if (this.selectedData.rowType == 'Alphabets') {
        alphabetCount = alphabetCount - skiprow;
      }
      else {
        skiprow--;
        alphabetCount = alphabetCount - skiprow;
      }

      for (let i = 0; i < this.selectedData.classes.length; i++) {

        for (let j = 0; j < this.selectedData.classes[i].rowRefList.length; j++) {
          let row: ColumnModel = this.selectedData.classes[i].rowRefList[j];
          if (row.checkBoxSelection == true) {
            let alphabet: string = '';
            if (this.selectedData.rowType == 'Alphabets') {

              if (alphabetCount > totalAlphabetCount) {
                //Reduce total alphabet calculate remain count
                let remainCount: number;
                remainCount = alphabetCount - totalAlphabetCount;
                let incrementingAlphabetCount = 0;
                incrementingAlphabetCount = Math.floor(alphabetCount / totalAlphabetCount);
                let alphabetPosition = this.calculateAlphabetCount(remainCount, totalAlphabetCount);
                alphabet = this.alphabets[incrementingAlphabetCount - 1] + this.alphabets[alphabetPosition - 1];
              } else {
                alphabet = this.alphabets[alphabetCount];
              }
            } else {
              alphabet = alphabetCount + "";
            }
            row.tableSequenceName = alphabet;
            alphabetCount--;
          } else {
            row.tableSequenceName = "";
          }
          if (this.selectedData.rowOrder == "Right to Left") {
            let counter: number = this.selectedData.classes[classNumber].columnsList.length - skipcolumn;
            for (let k = 0; k < this.selectedData.classes[i].seats.length; k++) {
              let seatObject: SeatLayoutModel = this.selectedData.classes[i].seats[k];
              seatObject.bookingStatus = "AVAILABLE";
              if (this.selectedData.classes[i].seats[k].coOrdinateX == j) {
                if (seatObject.seat == true) {
                  seatObject.inputDisabled = false;
                  seatObject.checkBoxDisabled = false;
                  seatObject.columnReference = counter;
                  seatObject.rowReference = row.tableSequenceName;
                  seatObject.rowLabel = seatObject.rowReference;
                  seatObject.seatNumber = seatObject.rowReference + seatObject.columnReference;
                  seatObject.tempSeatNumber = seatObject.rowReference + "-" + seatObject.columnReference
                  counter--;
                }
                else {
                  seatObject.columnReference = counter;
                  seatObject.rowReference = row.tableSequenceName;
                  seatObject.tempSeatNumber = seatObject.rowReference + "-" + seatObject.columnReference
                  seatObject.seatNumber = "";
                  seatObject.columnReference = null;
                  seatObject.rowReference = null;
                  if (row.tableSequenceName == null || row.tableSequenceName == "") {
                    seatObject.rowLabel = "";
                  } else {
                    seatObject.rowLabel = row.tableSequenceName;
                  }
                  seatObject.inputDisabled = true;
                  if (row.checkBoxSelection == false) {
                    seatObject.checkBoxDisabled = true;
                  }

                }
              }

            }
          }
          else {
            for (let k = 0; k < this.selectedData.classes[i].seats.length; k++) {
              let seatObject: SeatLayoutModel = this.selectedData.classes[i].seats[k];
              seatObject.bookingStatus = "AVAILABLE";
              if (this.selectedData.classes[i].seats[k].coOrdinateX == j) {
                let tempSeatNumber = seatObject.tempSeatNumber.split("-");
                if (seatObject.seat == true) {
                  seatObject.inputDisabled = false;
                  seatObject.checkBoxDisabled = false;
                  seatObject.columnReference = parseInt(tempSeatNumber[1]);
                  seatObject.rowReference = row.tableSequenceName;
                  seatObject.rowLabel = seatObject.rowReference;
                  seatObject.seatNumber = seatObject.rowReference + seatObject.columnReference;
                  seatObject.tempSeatNumber = seatObject.rowReference + "-" + seatObject.columnReference
                }
                else {
                  seatObject.columnReference = parseInt(tempSeatNumber[1]);
                  seatObject.rowReference = row.tableSequenceName;
                  seatObject.tempSeatNumber = seatObject.rowReference + "-" + seatObject.columnReference
                  seatObject.seatNumber = "";
                  seatObject.columnReference = null;
                  seatObject.rowReference = null;
                  if (row.tableSequenceName == null || row.tableSequenceName == "") {
                    seatObject.rowLabel = "";
                  } else {
                    seatObject.rowLabel = row.tableSequenceName;
                  }
                  seatObject.inputDisabled = true;
                  if (row.checkBoxSelection == false) {
                    seatObject.checkBoxDisabled = true;
                  }

                }
              }
            }
          }
        }
      }
    }
    else {
      // Bottom-Top seat Arrangement
      let alphabetCount = 0;
      let totalAlphabetCount = 25;
      for (let i = 0; i < this.selectedData.classes.length; i++) {
        // let classAlphabets: string[] = [];
        for (let j = 0; j < this.selectedData.classes[i].rowRefList.length; j++) {
          let row: ColumnModel = this.selectedData.classes[i].rowRefList[j];
          if (row.checkBoxSelection == true) {
            let alphabet: string = '';
            if (this.selectedData.rowType == 'Alphabets') {

              if (alphabetCount > totalAlphabetCount) {
                //Reduce total alphabet calculate remain count
                let remainCount: number;
                remainCount = alphabetCount - totalAlphabetCount;
                let incrementingAlphabetCount = 0;
                incrementingAlphabetCount = Math.floor(alphabetCount / totalAlphabetCount);
                let alphabetPosition = this.calculateAlphabetCount(remainCount, totalAlphabetCount);
                alphabet = this.alphabets[incrementingAlphabetCount - 1] + this.alphabets[alphabetPosition - 1];
              } else {
                alphabet = this.alphabets[alphabetCount];
              }
            } else {
              alphabet = (alphabetCount + 1) + "";
            }
            row.tableSequenceName = alphabet;
            alphabetCount++;
          } else {
            row.tableSequenceName = "";
          }
          if (this.selectedData.rowOrder == "Right to Left") {
            let counter: number = this.selectedData.classes[classNumber].columnsList.length - skipcolumn;
            for (let k = 0; k < this.selectedData.classes[i].seats.length; k++) {
              let seatObject: SeatLayoutModel = this.selectedData.classes[i].seats[k];
              let tempSeatNumber = seatObject.tempSeatNumber.split("-");
              seatObject.bookingStatus = "AVAILABLE";
              if (this.selectedData.classes[i].seats[k].coOrdinateX == j) {
                if (seatObject.seat == true) {
                  seatObject.inputDisabled = false;
                  seatObject.checkBoxDisabled = false;
                  seatObject.columnReference = counter;
                  seatObject.rowReference = row.tableSequenceName;
                  seatObject.rowLabel = seatObject.rowReference;
                  seatObject.seatNumber = seatObject.rowReference + seatObject.columnReference;
                  seatObject.tempSeatNumber = seatObject.rowReference + "-" + seatObject.columnReference
                  counter--;
                }
                else {
                  seatObject.columnReference = parseInt(tempSeatNumber[1]);
                  seatObject.rowReference = row.tableSequenceName;
                  seatObject.tempSeatNumber = seatObject.rowReference + "-" + seatObject.columnReference
                  seatObject.seatNumber = "";
                  seatObject.columnReference = null;
                  seatObject.rowReference = null;
                  if (row.tableSequenceName == null || row.tableSequenceName == "") {
                    seatObject.rowLabel = "";
                  } else {
                    seatObject.rowLabel = row.tableSequenceName;
                  }
                  seatObject.inputDisabled = true;
                  if (row.checkBoxSelection == false) {
                    seatObject.checkBoxDisabled = true;
                  }

                }
              }
            }
          }
          else {
            for (let k = 0; k < this.selectedData.classes[i].seats.length; k++) {
              let seatObject: SeatLayoutModel = this.selectedData.classes[i].seats[k];
              let tempSeatNumber = seatObject.tempSeatNumber.split("-");
              seatObject.bookingStatus = "AVAILABLE";
              if (this.selectedData.classes[i].seats[k].coOrdinateX == j) {
                if (seatObject.seat == true) {
                  seatObject.inputDisabled = false;
                  seatObject.checkBoxDisabled = false;
                  seatObject.columnReference = parseInt(tempSeatNumber[1]);
                  seatObject.rowReference = row.tableSequenceName;
                  seatObject.rowLabel = seatObject.rowReference;
                  seatObject.seatNumber = seatObject.rowReference + seatObject.columnReference;
                  seatObject.tempSeatNumber = seatObject.rowReference + "-" + seatObject.columnReference
                }
                else {
                  seatObject.columnReference = parseInt(tempSeatNumber[1]);
                  seatObject.rowReference = row.tableSequenceName;
                  seatObject.tempSeatNumber = seatObject.rowReference + "-" + seatObject.columnReference
                  seatObject.seatNumber = "";
                  seatObject.columnReference = null;
                  seatObject.rowReference = null;
                  if (row.tableSequenceName == null || row.tableSequenceName == "") {
                    seatObject.rowLabel = "";
                  } else {
                    seatObject.rowLabel = row.tableSequenceName;
                  }
                  seatObject.inputDisabled = true;
                  if (row.checkBoxSelection == false) {
                    seatObject.checkBoxDisabled = true;
                  }

                }
              }
            }
          }
        }
      }
    }
  }

  public onLabelChange(row: ColumnModel, classNumber: number) {
    for (let i = 0; i < this.selectedData.classes[classNumber].seats.length; i++) {
      if (this.selectedData.classes[classNumber].seats[i].coOrdinateX == row.tableSequenceId) {
        this.selectedData.classes[classNumber].seats[i].seatNumber = row.tableSequenceName + this.selectedData.classes[classNumber].seats[i].columnReference;
        this.selectedData.classes[classNumber].seats[i].rowLabel = row.tableSequenceName;
        this.selectedData.classes[classNumber].seats[i].rowReference = row.tableSequenceName;
        this.selectedData.classes[classNumber].seats[i].tempSeatNumber = row.tableSequenceName + "-" + this.selectedData.classes[classNumber].seats[i].columnReference;

      }
    }
  }

  public onNumberChange(column: ColumnModel, classNumber: number) {
    for (let i = 0; i < this.selectedData.classes[classNumber].seats.length; i++) {
      if (this.selectedData.classes[classNumber].seats[i].coOrdinateY == column.tableSequenceId) {
        this.selectedData.classes[classNumber].seats[i].seatNumber = this.selectedData.classes[classNumber].seats[i].rowReference + column.tableSequenceName;
        this.selectedData.classes[classNumber].seats[i].columnReference = +column.tableSequenceName;
        this.selectedData.classes[classNumber].seats[i].tempSeatNumber = this.selectedData.classes[classNumber].seats[i].rowReference + "-" + column.tableSequenceName;
      }
    }
  }

  public onRowChange(row: ColumnModel, classModel: ClassModel, classNumber: number) {
    debugger;
    //based on the row number and class need to select all for the row  
    for (let seatNo = 0; seatNo < classModel.seats.length; seatNo++) {
      if (classModel.seats[seatNo].coOrdinateX == row.tableSequenceId) {
        if (row.checkBoxSelection == true) {
          classModel.seats[seatNo].seat = true;
        } else {
          classModel.seats[seatNo].seat = false;
        }
      }
    }
    if (row.checkBoxSelection == false) {
      row.tableSequenceName = "";
    }

    let skiprow: number = 1;
    for (let k = 0; k < this.selectedData.classes.length; k++) {
      for (let i = 0; i < this.selectedData.classes[k].rowRefList.length; i++) {
        if (this.selectedData.classes[k].rowRefList[i].checkBoxSelection == false) {
          skiprow++;
        }
      }
    }

    let skipcolumn: number = 0;
    for (let i = 0; i < this.selectedData.classes[classNumber].columnsList.length; i++) {
      if (this.selectedData.classes[classNumber].columnsList[i].checkBoxSelection == false) {
        skipcolumn++;
      }
    }

    if (this.selectedData.columnOrder == "Top to Bottom") {
      // Top-Bottom seat Arrangement
      // let classAlphabets: string[] = [];
      let alphabetCount = 0;
      let totalAlphabetCount = 25;

      for (let i = 0; i < this.selectedData.classes.length; i++) {
        alphabetCount += this.selectedData.classes[i].rowRefList.length;
      }
      if (this.selectedData.rowType == 'Alphabets') {
        alphabetCount = alphabetCount - skiprow;
      }
      else {
        skiprow--;
        alphabetCount = alphabetCount - skiprow;
      }
      for (let i = 0; i < this.selectedData.classes.length; i++) {

        for (let j = 0; j < this.selectedData.classes[i].rowRefList.length; j++) {

          let row: ColumnModel = this.selectedData.classes[i].rowRefList[j];
          if (row.checkBoxSelection == true) {

            let alphabet: string = '';
            if (this.selectedData.rowType == 'Alphabets') {

              if (alphabetCount > totalAlphabetCount) {

                //Reduce total alphabet calculate remain count
                let remainCount: number;
                remainCount = alphabetCount - totalAlphabetCount;

                let incrementingAlphabetCount = 0;
                incrementingAlphabetCount = Math.floor(alphabetCount / totalAlphabetCount);

                let alphabetPosition = this.calculateAlphabetCount(remainCount, totalAlphabetCount);

                alphabet = this.alphabets[incrementingAlphabetCount - 1] + this.alphabets[alphabetPosition - 1];
              } else {
                alphabet = this.alphabets[alphabetCount];

              }
            } else {
              alphabet = alphabetCount + "";
            }
            row.tableSequenceName = alphabet;
            alphabetCount--;
          } else {
            row.tableSequenceName = "";

          }

          if (this.selectedData.rowOrder == "Right to Left") {
            let counter: number = this.selectedData.classes[i].columnsList.length - skipcolumn;
            for (let k = 0; k < this.selectedData.classes[i].seats.length; k++) {
              let seatObject: SeatLayoutModel = this.selectedData.classes[i].seats[k];
              seatObject.bookingStatus = "AVAILABLE";
              if (this.selectedData.classes[i].seats[k].coOrdinateX == j) {
                if (seatObject.seat == true) {
                  seatObject.inputDisabled = false;
                  seatObject.checkBoxDisabled = false;
                  seatObject.columnReference = counter;
                  seatObject.rowReference = row.tableSequenceName;
                  seatObject.rowLabel = seatObject.rowReference;
                  seatObject.seatNumber = seatObject.rowReference + seatObject.columnReference;
                  seatObject.tempSeatNumber = seatObject.rowReference + "-" + seatObject.columnReference;
                  counter--;
                } else {
                  seatObject.rowReference = row.tableSequenceName;
                  seatObject.columnReference = counter;
                  seatObject.tempSeatNumber = seatObject.rowReference + "-" + seatObject.columnReference;
                  seatObject.seatNumber = "";
                  seatObject.columnReference = null;
                  seatObject.rowReference = null;
                  //seatObject.rowLabel="space-"+this.selectedData.classes[i].seats[k].coOrdinateX+"-"+this.selectedData.classes[i].className.replace(" ","");
                  if (row.tableSequenceName == null || row.tableSequenceName == "") {
                    seatObject.rowLabel = "space-" + this.selectedData.classes[i].seats[k].coOrdinateX + "-" + this.selectedData.classes[i].className.replace(" ", "");
                  } else {
                    seatObject.rowLabel = row.tableSequenceName;
                  }
                  seatObject.inputDisabled = true;
                  if (row.checkBoxSelection == false) {
                    seatObject.checkBoxDisabled = true;
                  }
                }
              }
            }
          }
          else {
            let counter = 0;
            for (let k = 0; k < this.selectedData.classes[i].seats.length; k++) {
              let seatObject: SeatLayoutModel = this.selectedData.classes[i].seats[k];
              seatObject.bookingStatus = "AVAILABLE";
              if (this.selectedData.classes[i].seats[k].coOrdinateX == j) {
                if (seatObject.seat == true) {
                  seatObject.inputDisabled = false;
                  seatObject.checkBoxDisabled = false;
                  seatObject.columnReference = counter + 1;
                  seatObject.rowReference = row.tableSequenceName;
                  seatObject.rowLabel = seatObject.rowReference;
                  seatObject.seatNumber = seatObject.rowReference + seatObject.columnReference;
                  seatObject.tempSeatNumber = seatObject.rowReference + "-" + seatObject.columnReference;
                } else {
                  seatObject.rowReference = row.tableSequenceName;
                  seatObject.columnReference = counter;
                  seatObject.tempSeatNumber = seatObject.rowReference + "-" + seatObject.columnReference;
                  seatObject.seatNumber = "";
                  seatObject.columnReference = null;
                  seatObject.rowReference = null;
                  //seatObject.rowLabel="space-"+this.selectedData.classes[i].seats[k].coOrdinateX+"-"+this.selectedData.classes[i].className.replace(" ","");
                  if (row.tableSequenceName == null || row.tableSequenceName == "") {
                    seatObject.rowLabel = "space-" + this.selectedData.classes[i].seats[k].coOrdinateX + "-" + this.selectedData.classes[i].className.replace(" ", "");
                  } else {
                    seatObject.rowLabel = row.tableSequenceName;
                  }
                  seatObject.inputDisabled = true;
                  if (row.checkBoxSelection == false) {
                    seatObject.checkBoxDisabled = true;
                  }

                }
                counter++;
              }
            }
          }
        }
      }
    }
    else {

      // Bottom-Top Seat Arrangement
      let alphabetCount = 0;
      let totalAlphabetCount = 25;
      for (let i = 0; i < this.selectedData.classes.length; i++) {

        // let classAlphabets: string[] = [];
        for (let j = 0; j < this.selectedData.classes[i].rowRefList.length; j++) {

          let row: ColumnModel = this.selectedData.classes[i].rowRefList[j];
          if (row.checkBoxSelection == true) {

            let alphabet: string = '';
            if (this.selectedData.rowType == 'Alphabets') {

              if (alphabetCount > totalAlphabetCount) {

                //Reduce total alphabet calculate remain count
                let remainCount: number;
                remainCount = alphabetCount - totalAlphabetCount;

                let incrementingAlphabetCount = 0;
                incrementingAlphabetCount = Math.floor(alphabetCount / totalAlphabetCount);

                let alphabetPosition = this.calculateAlphabetCount(remainCount, totalAlphabetCount);

                alphabet = this.alphabets[incrementingAlphabetCount - 1] + this.alphabets[alphabetPosition - 1];
              } else {
                alphabet = this.alphabets[alphabetCount];

              }
            } else {
              alphabet = (alphabetCount + 1) + "";
            }
            row.tableSequenceName = alphabet;
            alphabetCount++;
          } else {
            row.tableSequenceName = "";

          }
          if (this.selectedData.rowOrder == "Right to Left") {
            let counter: number = classModel.columnsList.length - skipcolumn;
            for (let k = 0; k < this.selectedData.classes[i].seats.length; k++) {
              let seatObject: SeatLayoutModel = this.selectedData.classes[i].seats[k];
              seatObject.bookingStatus = "AVAILABLE";
              if (this.selectedData.classes[i].seats[k].coOrdinateX == j) {
                if (seatObject.seat == true) {
                  seatObject.inputDisabled = false;
                  seatObject.checkBoxDisabled = false;
                  seatObject.columnReference = counter;
                  seatObject.rowReference = row.tableSequenceName;
                  seatObject.rowLabel = seatObject.rowReference;
                  seatObject.seatNumber = seatObject.rowReference + seatObject.columnReference;
                  seatObject.tempSeatNumber = seatObject.rowReference + "-" + seatObject.columnReference;
                  counter--;
                } else {
                  seatObject.seatNumber = "";
                  seatObject.columnReference = null;
                  seatObject.rowReference = null;
                  //seatObject.rowLabel="space-"+this.selectedData.classes[i].seats[k].coOrdinateX+"-"+this.selectedData.classes[i].className.replace(" ","");
                  if (row.tableSequenceName == null || row.tableSequenceName == "") {
                    seatObject.rowLabel = "space-" + this.selectedData.classes[i].seats[k].coOrdinateX + "-" + this.selectedData.classes[i].className.replace(" ", "");
                  } else {
                    seatObject.rowLabel = row.tableSequenceName;
                  }
                  seatObject.inputDisabled = true;
                  if (row.checkBoxSelection == false) {
                    seatObject.checkBoxDisabled = true;
                  }
                }
              }
            }
          }
          else {
            let counter = 0;
            for (let k = 0; k < this.selectedData.classes[i].seats.length; k++) {
              let seatObject: SeatLayoutModel = this.selectedData.classes[i].seats[k];
              seatObject.bookingStatus = "AVAILABLE";
              if (this.selectedData.classes[i].seats[k].coOrdinateX == j) {
                if (seatObject.seat == true) {
                  seatObject.inputDisabled = false;
                  seatObject.checkBoxDisabled = false;
                  seatObject.columnReference = counter + 1;
                  seatObject.rowReference = row.tableSequenceName;
                  seatObject.rowLabel = seatObject.rowReference;
                  seatObject.seatNumber = seatObject.rowReference + seatObject.columnReference;
                  seatObject.tempSeatNumber = seatObject.rowReference + "-" + seatObject.columnReference;
                  counter++;
                } else {
                  seatObject.seatNumber = "";
                  seatObject.columnReference = null;
                  seatObject.rowReference = null;
                  //seatObject.rowLabel="space-"+this.selectedData.classes[i].seats[k].coOrdinateX+"-"+this.selectedData.classes[i].className.replace(" ","");
                  if (row.tableSequenceName == null || row.tableSequenceName == "") {
                    seatObject.rowLabel = "space-" + this.selectedData.classes[i].seats[k].coOrdinateX + "-" + this.selectedData.classes[i].className.replace(" ", "");
                  } else {
                    seatObject.rowLabel = row.tableSequenceName;
                  }
                  seatObject.inputDisabled = true;
                  if (row.checkBoxSelection == false) {
                    seatObject.checkBoxDisabled = true;
                  }

                }
              }
            }
          }
        }
      }
    }
  }

  /* Save Details**/
  public saveScreenDetail() {
    this.log.info("SAVE METHOD");

    let validationMessage = this.validation();
    if (validationMessage == false) {
      this.saveScreen();
    } else {
      this.openSnackBar("Please fill the red marked fields", validationMessage);
    }
  }


  convertSeatLayoutModel(coOrdinateX: number, coOrdinateY: number,
    rowReference: string, columnReference: number): SeatLayoutModel {

    let seatLayoutModel = new SeatLayoutModel();
    seatLayoutModel.coOrdinateX = coOrdinateX;
    seatLayoutModel.coOrdinateY = coOrdinateY;
    seatLayoutModel.seat = true;
    seatLayoutModel.rowReference = rowReference;
    seatLayoutModel.rowLabel = seatLayoutModel.rowReference;
    seatLayoutModel.columnReference = columnReference + 1;
    seatLayoutModel.seatNumber = seatLayoutModel.rowReference + seatLayoutModel.columnReference;
    seatLayoutModel.tempSeatNumber = seatLayoutModel.rowReference + "-" + seatLayoutModel.columnReference
    seatLayoutModel.bookingStatus = "AVAILABLE";

    return seatLayoutModel;
  }

  saveScreen() {

    let header = new Header(UUID.UUID());
    this.selectedData.header = header;
    this.selectedData.defaultShowTimes = this.showTimes;
    this.selectedData.active = 0;
    this.selectedData.experienceId = this.selectedExperience;
    if (this.selectedData.live == true) {
      this.selectedData.active = 1;
    }

    this.restService.post(this.selectedData, environment.addScreenPath)
      .subscribe(response => {
        this.isSeatLayoutScreen = true;
        this.isScreenPage = false;
        this.getAllFareInformations();
        this.selectedData.classes = response.screen.classes;
        for (let i = 0; i < this.selectedData.classes.length; i++) {
          this.selectedData.classes[i].fareList = this.fareList;
        }
      }, err => {
        var errorVal = err.status.statusDescription;
        this.openSnackBar("ERROR MSG", errorVal)
      });
  }

  public calculateAlphabetCount(remainCount: number, totalAlphabetCount: number): number {

    if (remainCount > totalAlphabetCount) {
      let calculatedCount = remainCount - totalAlphabetCount;
      return this.calculateAlphabetCount(calculatedCount, totalAlphabetCount);
    } else {
      return remainCount;
    }
  }
  // Validation part 
  validation() {
    if (this.selectedData.venueId == null) {
      return 'Venue is required!';
    } else if (this.selectedData.screenName == null || this.selectedData.screenName == '') {
      return 'Screen Name is required!';
    } else if (this.showTimes.length == 0) {
      return 'Show Times is required!';
    } else if (this.selectedData.classCount == undefined || this.selectedData.classCount == 0) {
      return 'Class is required!';
    } else if (this.selectedData.rowCount == undefined || this.selectedData.rowCount == 0) {
      return 'Rows is required!';
    } else if (this.selectedData.columnCount == undefined || this.selectedData.columnCount == 0) {
      return 'Colums is required!';
    } else {
      return false;
    }
  }

  private getAllFareInformations() {

    let request = <RequestHeader>({});
    let header = new Header(UUID.UUID());
    request.header = header;

    this.restService.post(request, environment.getAllFarePath)
      .map((fare: any) => {
        if (fare) {
          fare.fares.forEach(erg => {
            this.fareList.push(new DropDownModel(erg.fareId,
              erg.fareName + " (" + erg.baseFare + ")"));
          });
        }
      })
      .subscribe(result => { },
        err => { });
  }

  onFareChange(classModel: ClassModel, i: number) {

    this.selectedData.classes[i].fareId = classModel.selectedFare.id;
    this.selectedData.classes[i].fareAmount = classModel.selectedFare.name;

  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  myErrorStateMatcher(): boolean {
    return true;
  }

  trackByIndex(index: number): any {
    return index;
  }

}