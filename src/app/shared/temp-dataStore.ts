import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LogService } from './services/log.service';

@Injectable()
export class TempDataService {
  debugger;
  private dataSource = new BehaviorSubject<any>("noData");
  private seletedDataSource = new BehaviorSubject<any>("noData");
  currentdata = this.dataSource.asObservable();
  currentSelectedData = this.seletedDataSource.asObservable();
  movieId = new Subject<string>();
  getMovieId = this.movieId.asObservable();

  constructor(private log: LogService) { }
  changeMessage(data: any) {
    this.dataSource.next(data);
    this.log.info(this.dataSource);
  }

  changeSelecedData(seletedData: any) {
    this.log.info(" TempDataService :: " + JSON.stringify(seletedData))
    // localStorage.setItem('editVenue', JSON.stringify(seletedData));
    this.seletedDataSource.next(seletedData);
  }

  selectedMovieDetail(id: string) {
    this.movieId.next(id);
console.log(id)
  }

  // getselectedMovieDetail(): string {
  //   console.log(this.movieId)
  //   return this.movieId;
  // }
}


