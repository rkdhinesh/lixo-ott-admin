import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { TokenStorage } from './shared/guard/token-storage';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { LogService } from './shared/services/log.service';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class RestService {
  // Api Service
  constructor(private http: HttpClient,
    private log: LogService,
    private router: Router, private token: TokenStorage) { }
  httpOptions = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  post(dataObject: any, dataurl: String): Observable<any> {
    this.log.info("POST: " + JSON.stringify(dataObject));
    const url = `${environment.baseUrl}${dataurl}`;

    this.log.info(url);

    return this.http
      .post(url, JSON.stringify(dataObject))
      .map(this.extractAllData)
      .do(data => this.log.info('User from json: ' + JSON.stringify(data)));
  }

  get(dataurl: String): Observable<any> {
    const url = `${environment.baseUrl}${dataurl}`;
    return this.http.get(url)
      .map(this.extractAllData)
      .do(data => this.log.info('User from json: ' + JSON.stringify(data)))
      .catch(this.handleError);
  }

  getWithHeaders(
    httpRequst?: IHttpClientRequestConfig
  ): Observable<any> {
    return this.http
      .get<any>(
        this.buildRequestUrl(httpRequst.url),
        this.buildHttpOptions(httpRequst)
      )
      .pipe(catchError(this.errorHandler));
  }




  put(dataObject: any, dataurl: String): Observable<any> {
    const url = `${environment.baseUrl}${dataurl}`;
    return this.http
      .put(url, JSON.stringify(dataObject))
      .map(this.extractAllData)
      .catch(this.handleError);
  }

  delete(dataurl: String): Observable<any> {
    const url = `${environment.baseUrl}${dataurl}`;
    return this.http
      .delete(url)
      .map(this.extractAllData)
      .catch(this.handleError);
  }

  

  extractData(response: Response) {
    return response.text() ? response.json() : {};;
  }

  private extractAllData(response: Response) {
    return response;
  }


  private handleError(error: Response) {
    //sthis.log.error('=== ' + error.status);
    if (error.status === 401 || error.status === 500) {
      // auto logout if 401 response returned from api
      this.router.navigate(['']);
      this.token.signOut();

      // location.reload(true);
    }
    return Observable.throw(error.json());
  }

  errorHandler(error: HttpErrorResponse) {
    return throwError(error);
  }

  private buildRequestUrl(endpoint: string): string {
    return `${environment.baseUrl}${endpoint}`;
  }

  private buildHttpOptions(config: IHttpClientRequestConfig): any {
    return {
      headers: config.headers ? config.headers : this.httpOptions,
      observe: config.observe,
      params: config.params,
      reportProgress: config.reportProgress,
      responseType: config.responseType,
      withCredentials: config.withCredentials,
    };
  }

}
export interface IHttpClientRequestConfig {
  url: string;
  data?: any;
  headers?: any;
  params?: any;
  observe?: string;
  timeout?: number;
  responseType?: string;
  method?: string;
  reportProgress?: boolean;
  withCredentials?: boolean;
}
