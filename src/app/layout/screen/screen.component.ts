import { Component, OnInit } from '@angular/core';
import { TempDataService } from '../../shared/temp-dataStore';
import { RestService } from '../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ScreenModel } from '../../shared/model/screen-model';
import { Header } from '../../shared/services/header';
import { UUID } from '../../shared/services/uuid';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { LogService } from '../../shared/services/log.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-screen',
  templateUrl: './screen.component.html',
  styleUrls: ['./screen.component.scss']
})
export class ScreenComponent implements OnInit {
  ioObjArray: ScreenModel[] = [];

  /* Material design variables */
  value = 50;
  length = 0;
  pageSize = 5;
  pageSizeOptions = [5, 10, 25, 100];
  pageIndex = 0;
  items: ScreenModel[] = [];
  totalItems: ScreenModel[] = [];
  color = 'primary';
  mode = 'determinate';
  FormObj;
  pageEvent: PageEvent;
  dialogRef;
  deletedialogRef;
  venueId: number;
  isLoading: boolean = true;
  queryString: string = ""
  errorMessage: string = '';
  constructor(private restService: RestService,
    public dialog: MatDialog, public router: Router, private route: ActivatedRoute,
    public tempDataService: TempDataService, public snackBar: MatSnackBar, private log: LogService) {

  }


  ngOnInit() {
    this.venueId = Number(this.route.snapshot.paramMap.get('venueId'));
    this.log.info('Venune Id :: ' + this.venueId);

    this.getAllScreenDetails();
    if (this.pageEvent) {
      this.pagenationEvent;
    }
  }


  private getAllScreenDetails() {
    let header = new Header( UUID.UUID());
    let screen = <ScreenModel>({});
    screen.header = header;
    screen.venueId = this.venueId;
    this.restService.post(screen, environment.viewAllScreenPath)
      .map((screenResponse: any) => {
        let result: Array<ScreenModel> = [];
        if (screenResponse) {
          this.isLoading = false;
          screenResponse.screens.forEach(erg => {
            let screenModel = new ScreenModel();
            screenModel.screenId = erg.screenId;
            screenModel.screenName = erg.screenName;
            screenModel.venueId = this.venueId;
            screenModel.dimension = erg.dimension;
            screenModel.synopsis = erg.synopsis;
            screenModel.live = false;
            if (erg.active == 1) {
              screenModel.live = true;
            }

            result.push(screenModel);
          });
        }
        this.totalItems = result;
        return result;
      })
      .subscribe(result => {
        this.ioObjArray = result;
        this.length = this.ioObjArray.length;
        this.log.info(this.length);
        if (this.length > 0) {
          this.pagenation(this.pageIndex, this.pageSize);
        }
      },);
  }
  /* Pagenation on change event **/
  public pagenationEvent(event) {
    this.pageEvent = event;
    var page_index = this.pageEvent.pageIndex;
    var page_size = this.pageEvent.pageSize;
    this.pagenation(page_index, page_size)
  }

  /* Pagenation Method **/
  public pagenation(page_index, page_size) {
    var page_index = page_index;
    var page_size = page_size;
    var page_length = this.ioObjArray.length;
    var end_index = ((page_size * page_index) + page_size) - 1;
    var start_index = ((page_size * page_index));
    this.items = [];
    this.log.info(JSON.stringify(this.ioObjArray));
    for (var i = start_index; i <= end_index; i++) {
      if (i < page_length) {
        let screenModel = new ScreenModel();
        screenModel.screenId = this.ioObjArray[i].screenId;
        screenModel.screenName = this.ioObjArray[i].screenName;
        screenModel.dimension = this.ioObjArray[i].dimension;
        screenModel.synopsis = this.ioObjArray[i].synopsis;
        screenModel.venueId = this.venueId;
        screenModel.live = this.ioObjArray[i].live;
        this.items.push(screenModel);
      }

    }
    this.log.info(` pagenation ${JSON.stringify(this.items)}`)
    return this.items;
  }



  /* Delete details**/

  delete(screen: ScreenModel) {
    this.deletedialogRef = this.dialog.open(YesOrNoDialogComponent, {

      disableClose: true
    });
    this.deletedialogRef.afterClosed().subscribe(result => {
      this.log.info("after closed:result");
      this.log.info(result);
      if (result === true) {
        let header = new Header( UUID.UUID());

        screen.header = header;

        this.deleteDetail(screen);
      } else {

      }
    });
    this.deletedialogRef.componentInstance.modal_name = "DELETE ACCOUNT"
  }

  private deleteDetail(data: any) {
    let venueName: string;
    venueName = data.venueName;
    this.restService.post(data, environment.deleteScreenPath)
      .map((screens: any) => {
        let result: Array<ScreenModel> = [];
        if (ScreenModel instanceof Array) {
          screens.forEach((erg) => {
            this.log.info("Delete===");
            let screenModel = new ScreenModel();
            screenModel.screenId = erg.screenId;
            screenModel.venueId = erg.venueId;
            result.push(screenModel);

          });
          return result;
        } else {
          this.log.info("===============" + screens.status["statusCode"]);
          if (screens.status["statusCode"] = '1001') {
            this.openSnackBar(venueName, "Deleted Successfully");
            this.getAllScreenDetails();
            this.log.info("--------------" + screens.status["statusCode"]);
          }
        }

      })
      .subscribe(screens => this.ioObjArray = screens);
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  myErrorStateMatcher(): boolean {
    return true;
  }

  editdata(data: any) {
    this.log.info("DATA=====" + JSON.stringify(data));
    this.log.info(JSON.stringify(data));
    this.log.info('setting to datastore');
    this.tempDataService.changeSelecedData(data);

    return true;
  }

  public addScreen() {

    this.router.navigate(['/add-screen', { venueId: this.venueId }]);
  }

}