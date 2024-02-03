import { Component, OnInit, ViewChild } from '@angular/core';
import { Headers } from '../../shared/model/request-header';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RestService } from '../../api.service';
import { Router } from '@angular/router';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';
import { UUID } from '../../shared/services/uuid';
import { TempDataService } from '../../shared/temp-dataStore';
import { environment } from '../../../environments/environment';
import { LogService } from '../../shared/services/log.service';
import { Header } from '../../shared/services/header';
import { DisplayMovie } from './display-movie-model';
import { CineastDetails } from './add-movie-mapping/cineast-add-movie-mapping';
import { ScreenAccessService } from '../../../app/shared/services/screen-access.service';



export class MovieHeader {
  header: Header;
  movieId: Number;
  constructor() { }
}
@Component({
  selector: 'app-movie-mapping',
  templateUrl: './movie-mapping.component.html',
  styleUrls: ['./movie-mapping.component.scss']
})
export class MovieMappingComponent implements OnInit {
  selectedData: CineastDetails;
  headers: Headers;
  header = new Header(UUID.UUID());
  errorMessage: string;
  ioObjArray: CineastDetails[] = [];
  selectedmovieid: any;
  movieMapping: any;
  cdetails: any;
  data: any;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  dataSource: any;
  displayedColumns: string[] = ['movieName', 'cineastName', 'roleName', 'roleType', 'action'];

  operationAccessMap = new Map();

  color = 'primary';
  mode = 'determinate';
  FormObj;
  pageEvent: PageEvent;
  dialogRef;
  deletedialogRef;

  constructor(private restService: RestService, public dialog: MatDialog,
    public router: Router, public tempDataService: TempDataService,
    private screenAccess: ScreenAccessService,
    public snackBar: MatSnackBar, private log: LogService) { }

  /* On load pagenation Event*/
  ngOnInit() {

    this.headers = <Headers>{
      header: this.header
    }

    this.screenAccess.loadOperationsAccessForScreen('Cineast Management', 'Movie Mapping');
    this.operationAccessMap = this.screenAccess.map;
    this.getAllMovieMapping()
  }

  /* Delete details**/
  delete(uniqueaccountType) {
    this.deletedialogRef = this.dialog.open(YesOrNoDialogComponent, {
      disableClose: true
    });
    this.deletedialogRef.afterClosed().subscribe(result => {
      this.log.info('after closed:result');
      this.log.info(result);
      if (result === true) {
        this.deleteDetail(uniqueaccountType);
      } else {
      }
    });
    this.deletedialogRef.componentInstance.modal_name = 'DELETE ACCOUNT'
  }

  deleteDetail(data: any) {
    const deleteMovie = <DisplayMovie>({
      movieCineastId: data.movieCineastId,
      header: this.header
    })
    this.log.info('Delete Method' + JSON.stringify(data));
    this.restService.post(deleteMovie, environment.getCineastMoviedelete)
      .map((cineastDetails: any) => {
        const result: Array<CineastDetails> = [];
        if (CineastDetails instanceof Array) {
          cineastDetails.forEach((erg) => {
            this.log.info('Delete===');
            result.push(new CineastDetails
              (erg.cineastId, erg.cineastName, erg.profileImage, erg.roleId, erg.roleName, erg.roleType,
                erg.roleDescription, erg.displayOrder
              ));
          });
          return result;
        } else {
          if (cineastDetails.status.statusCode == '1001') {
            this.openSnackBar('Deleted Successfully', data.cineastName);
            this.getAllMovieMapping();
          } else if (cineastDetails.status.statusCode == '1002') {
            this.openSnackBar('Operation Failed', data.cineastName);
          }
        }
      })
      .subscribe(cineastDetails => this.ioObjArray = cineastDetails);
  }


  getAllMovieMapping() {
    this.restService.post(this.headers, environment.getAllCineastMovieMapping)
      .map((response: any) => {
        const result: Array<DisplayMovie> = [];
        if (response) {
          response.movieCineasts.forEach(erg => {
            let mmaping = new DisplayMovie(erg.movieId, erg.movieName, erg.movieCineastId, erg.CineastDetail);
            let cineastdetails: Array<CineastDetails> = [];
            erg.cineastDetails.forEach((newcineastdetail: any) => {
              cineastdetails.push(newcineastdetail);
            })
            mmaping.mapp = cineastdetails;
            result.push(mmaping);
          });
        }
        return result;
      })
      .subscribe(result => {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}

