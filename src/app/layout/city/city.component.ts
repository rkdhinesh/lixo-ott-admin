import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { City } from '../city/city';
import { Headers } from '../../shared/model/request-header';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LogService } from '../../shared/services/log.service';
import { TempDataService } from '../../shared/temp-dataStore';
import { UUID } from '../../shared/services/uuid';
import { Header } from '../../shared/services/header';
import { environment } from '../../../environments/environment';
import { RestService } from '../../api.service';
import { ScreenAccessService } from '../../shared/services/screen-access.service';
import { YesOrNoDialogComponent } from '../../shared/components/YesOrNoDialogs/YesOrNoDialogComponent';


@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {
  headers: Headers;
  header = new Header(UUID.UUID());
  dataSource: MatTableDataSource<City>;
  ioObjArray: City[] = [];
  isLoading: boolean = true;
  deletedialogRef;
  displayedColumns: string[] = ['city','zone', 'state', 'country', 'action'];
  operationAccessMap = new Map();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private screenAccess: ScreenAccessService, private http: HttpClient, public snackBar: MatSnackBar,
    public dialog: MatDialog, public restService: RestService, public router: Router, public tempDataService: TempDataService,
    private log: LogService) { }

  ngOnInit() {
    this.headers = <Headers>{
      header: this.header
    }
    this.screenAccess.loadOperationsAccessForScreen('Zone Management', 'City');
    this.operationAccessMap = this.screenAccess.map;

    this.getAllCitys();
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  getAllCitys() {
    this.restService.get(environment.getcity)
      .map((citys: any) => {
        let result: Array<City> = [];
        if (citys) {
          this.isLoading = false;
          let cityArray = citys;
          cityArray.forEach((erg) => {
            this.ioObjArray = erg;
            result.push(new City(erg.city_id, erg.city, erg.zone_id,  erg.state,
              erg.country,  erg.image_icon, erg.popular_city,erg.zone ));
             
          });
        }
        return result;
      }).subscribe(result => {
        this.dataSource = new MatTableDataSource(result);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
  }

  delete(cityDetails) {
    this.deletedialogRef = this.dialog.open(YesOrNoDialogComponent, {
      disableClose: true
    });
    this.deletedialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.deleteCity(cityDetails);
      }
    });
    this.deletedialogRef.componentInstance.modal_name = "DELETE CITY";
  }

  private deleteCity(city) {
    let cityId = city.city_id;
    this.restService.delete(environment.deletecity + cityId)
      .subscribe(res => {
        this.openSnackBar(city.city, "Delete Successfully");
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate(['/city']);
      });
  }

  editdata(data: any) {
    this.log.info('DATA=====' + JSON.stringify(data));
    this.log.info(JSON.stringify(data));
    this.log.info('setting to datastore');
    data.editable = false;
    this.tempDataService.changeSelecedData(data);
    return true;
  }

  // Apply filter based on search query
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim().toLowerCase();
    
    // Custom filterPredicate to filter by first two letters of city name
    this.dataSource.filterPredicate = (data: City, filter: string) => {
      return data.city.toLowerCase().startsWith(filter);
    };
    
    this.dataSource.filter = filterValue;
  }
  
}
