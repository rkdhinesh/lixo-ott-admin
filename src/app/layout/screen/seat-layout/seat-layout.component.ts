import { Component, OnInit, Input } from '@angular/core'; import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Header } from '../../../shared/services/header';
import { ClassModel } from '../../../shared/model/class-model';
import { ScreenModel } from '../../../shared/model/screen-model';
import { UUID } from '../../../shared/services/uuid';
import { SeatLayoutModel } from '../../../shared/model/seat-layout-model';
import { ColumnModel } from '../../../shared/model/column-model';
import { MatRadioChange } from '@angular/material/radio';
import { SeatLayoutBookingStatusRequest, seats } from './SeatLayoutBookingStatusRequest';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';

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
  selector: 'app-seat-layout',
  templateUrl: './seat-layout.component.html',
  styleUrls: ['./seat-layout.component.scss'],
})
export class SeatLayoutComponent implements OnInit {

  selectedSeats: string[] = [];
  seatOption: any;
  selectedSeatStatus: Array<string>;
  chosenItem: string;
  selectedData: ScreenModel;
  fareList: DropDownModel[] = [];
  isLoading: boolean = true;
  isSeatLayoutScreen: boolean = false;
  isSeatLayoutPreviewScreen: boolean = true;
  isEditSeatLayoutScreen: boolean = false;

  alphabets: string[] = [];


  classLists: ClassModel[] = [];

  constructor(private tempDataService: TempDataService,
    private restService: RestService, private route: ActivatedRoute,
    private router: Router, public snackBar: MatSnackBar, private log: LogService) {


  }

  private fetchClassInformationBasedOnScreen() {
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
        return this.fareList;
      })
      .subscribe(result => {
        let header = new Header(UUID.UUID());
        let screen = <ScreenModel>({});
        screen.header = header;
        screen.screenId = this.selectedData.screenId;
        this.restService.post(screen, environment.viewAllClassesForScreenPath)
          .map((classesResponse: any) => {
            //class list created with fare detail
            if (classesResponse) {
              classesResponse.classes.forEach(erg => {

                let classModel = new ClassModel();
                classModel.classId = erg.classId;
                classModel.className = erg.className;
                classModel.synopsis = erg.synopsis;
                classModel.fareAmount = this.fareList.find(item => item.id == erg.fareId).name;
                this.classLists.push(classModel);
              });
            }
            return this.classLists;
          }).subscribe(result => {
            this.classLists = result;
            this.classLists.forEach(element => {
              let header = new Header(UUID.UUID());
              element.header = header;
              this.restService.post(element, environment.viewAllSeatLayoutForClassPath)
                .subscribe((seatLayoutResponse: any) => {

                  let result: Array<SeatLayoutModel> = [];
                  let columnsList1: ColumnModel[] = [];
                  let rowRefList1: ColumnModel[] = [];
                  let columnStringArray: String[] = [];
                  let rowStringArray: String[] = [];
                  if (seatLayoutResponse) {
                    seatLayoutResponse.seats.forEach((erg) => {
                      let seatLayout = new SeatLayoutModel();
                      seatLayout.coOrdinateX = erg.coOrdinateX;
                      seatLayout.coOrdinateY = erg.coOrdinateY;
                      seatLayout.seat = erg.seat;
                      seatLayout.seatNumber = erg.seatNumber;
                      seatLayout.tempSeatNumber = erg.seatNumber;
                      seatLayout.rowLabel = erg.rowLabel;
                      seatLayout.seatId = erg.seatId;
                      seatLayout.bookingStatus = erg.bookingStatus;

                      let tableSequenceName: number = erg.coOrdinateY + 1;

                      columnStringArray.push(erg.coOrdinateY + "--" + tableSequenceName);
                      rowStringArray.push(erg.coOrdinateX + "--" + erg.coOrdinateX);

                      result.push(seatLayout);
                    });
                  }
                  let columnsList: ColumnModel[] = [];
                  let rowRefList: ColumnModel[] = [];

                  let columnStringArray1: String[] = [];
                  let rowStringArray1: String[] = [];
                  columnStringArray1 = Array.from(new Set(columnStringArray));
                  rowStringArray1 = Array.from(new Set(rowStringArray));

                  columnStringArray1.forEach(element => {
                    let obj: String[] = element.split("--");
                    columnsList.push(new ColumnModel(Number(obj[0]), obj[1] + "", true));

                  });

                  rowStringArray1.forEach(element => {
                    let obj: String[] = element.split("--");
                    rowRefList.push(new ColumnModel(Number(obj[0]), Number(obj[0]) + "", true));

                  });

                  columnsList.sort((a, b) => {
                    if (a.tableSequenceId < b.tableSequenceId) return -1;
                    else if (a.tableSequenceId > b.tableSequenceId) return 1;
                    else return 0;
                  });

                  rowRefList.sort((a, b) => {
                    if (a.tableSequenceId < b.tableSequenceId) return -1;
                    else if (a.tableSequenceId > b.tableSequenceId) return 1;
                    else return 0;
                  });

                  element.seats = result;

                  for (let i = 0; i < rowRefList.length; i++) {
                    let flag = false;
                    for (let seatNo = 0; seatNo < element.seats.length; seatNo++) {
                      if (rowRefList[i].tableSequenceId == element.seats[seatNo].coOrdinateX) {
                        if (element.seats[seatNo].seat) {
                          flag = true;
                          break;
                        }
                      }
                    }
                    rowRefList[i].checkBoxSelection = flag;
                  }
                  element.rowRefList = rowRefList;

                  for (let i = 0; i < columnsList.length; i++) {
                    let flag = false;
                    for (let seatNo = 0; seatNo < element.seats.length; seatNo++) {
                      if (columnsList[i].tableSequenceId == element.seats[seatNo].coOrdinateY) {
                        if (element.seats[seatNo].seat) {
                          flag = true;
                          break;
                        }
                      }
                    }
                    if (!flag) {
                      columnsList[i].tableSequenceName = "";
                    }
                    columnsList[i].checkBoxSelection = flag;
                  }
                  element.columnsList = columnsList;

                  this.isLoading = false;
                  this.selectedData.classes = this.classLists;

                  //Number to Alphapet convertion logic
                  var ap = 'A'.charCodeAt(0);
                  var loopEnd = 'Z'.charCodeAt(0);
                  let x = 0;

                  for (ap; ap <= loopEnd; ap++) {
                    this.alphabets[x] = String.fromCharCode(ap);
                    x++;
                  }

                  //class
                  for (let i = 0; i < this.selectedData.classes.length; i++) {
                    //row
                    for (let j = 0; j < this.selectedData.classes[i].rowRefList.length; j++) {
                      let row: ColumnModel = this.selectedData.classes[i].rowRefList[j];
                      let count: number = 0;
                      for (let k = 0; k < this.selectedData.classes[i].columnsList.length; k++) {
                        for (let l = 0; l < this.selectedData.classes[i].seats.length; l++) {
                          if (this.selectedData.classes[i].seats[l].coOrdinateX == j && this.selectedData.classes[i].seats[l].coOrdinateY == k) {
                            if (this.selectedData.classes[i].seats[l].seat == true) {
                              row.tableSequenceName = this.selectedData.classes[i].seats[l].rowLabel;
                            }
                            else {
                              count++;
                            }
                          }
                        }
                      }
                      if (count == this.selectedData.classes[i].columnsList.length) {
                        row.tableSequenceName = "";
                      }
                      count = 0;
                    }
                  }
                  this.isLoading = false;
                });
            });
          }, err => {
          });
      }, err => {

      });

  }

  ngOnInit() {
    this.selectedData = JSON.parse(localStorage.getItem('screen'));
    this.log.info(JSON.stringify(this.selectedData));
    this.selectedSeatStatus = ['AVAILABLE', 'DEFAULT_BLOCKED', 'LOCKED', 'SOCIAL DISTANCE'];
    this.selectedSeats = [];
    this.seatOption = this.selectedSeatStatus[0];
    localStorage.setItem("seatStatus", this.seatOption);
    this.fetchClassInformationBasedOnScreen();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  seatStatusUpdate() {

    let header = new Header(UUID.UUID());
    let request = new SeatLayoutBookingStatusRequest();
    request.header = header;
    let seatList: seats[] = [];
    for (let i = 0; i < this.selectedSeats.length; i++) {
      let seat = new seats();
      seat.seatId = parseInt(this.selectedSeats[i]);
      seat.bookingStatus = this.seatOption;
      seatList.push(seat);
    }
    request.seatIds = seatList;

    this.restService.post(request, environment.updateSeatLayoutBookingStatusPath)
      .subscribe(
        result => {
          this.log.info('inside response' + result.statusCode + '' + result.statusDescription + '' + result.transactionId);
          if (result.statusCode = '1001') {
            this.openSnackBar("Successfully Updated SeatLayout Booking Status", "success");
            this.router.navigate(['/seat-layout'])
              .then(() => {
                window.location.reload();
              });
          }
          else {
            this.openSnackBar("Failed Updated Seat Status", "Fail");
            this.router.navigate(['/seat-layout']);
          }
        }
        , err => {
          var errorVal = err.status.statusDescription;
          this.openSnackBar("ERROR :  While Updating SeatLayout Booking Status", errorVal)
        });
  }

  radioChange(event: MatRadioChange) {
    this.seatOption = event.value;
    if (event.value === 'DEFAULT_BLOCKED') {
      this.seatOption = 'DEFAULT_BLOCKED';
      console.log("~~~~~~~~~~~~~~~~~~~~~~~~~" + this.seatOption);
    }
    localStorage.setItem("seatStatus", this.seatOption);
  }

  seatSelect(seat: any) {
    if (seat.selectedstatus_ui == 0 || seat.selectedstatus_ui == '' || seat.selectedstatus_ui == null) {
      seat.selectedstatus_ui = 1;
      this.selectedSeats.push(seat.seatId);
    }
    else {
      seat.selectedstatus_ui = 0;
      let index = this.selectedSeats.indexOf(seat.seatId);
      if (index !== -1) this.selectedSeats.splice(index, 1);
    }
  }
}