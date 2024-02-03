import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MovieMappingResponse } from '../movieMappingResponse';
import { MovieMappingDetails } from '../moviemapping';
import { DisplayMovie } from '../display-movie-model';
import { CineastDetails } from './cineast-add-movie-mapping';
import { LogService } from '../../../shared/services/log.service';
import { RestService } from '../../../../app/api.service';
import { Header } from '../../../shared/services/header';
import { UUID } from '../../../shared/services/uuid';
import { environment } from '../../../../environments/environment';



export class MovieHeader {
  header: Header;

  constructor() { }
}

export class getMovieRequest {
  header: Header;
  movieId: number;
  constructor() { }
}

export class MovieDropDownModel {
  id: number;
  name: string;
  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class RoleDropDownModel {
  id: number;
  name: string;
  type: string;
  constructor(id: number, name: string, type: string) {
    this.id = id;
    this.name = name;
    this.type = type;
  }
}

@Component({
  selector: 'app-add-movie-mapping',
  templateUrl: './add-movie-mapping.component.html',
  styleUrls: ['./add-movie-mapping.component.scss']
})
export class AddMovieMappingComponent implements OnInit {
  data: any;
  selectedData: MovieDropDownModel;
  header = new Header(UUID.UUID());
  headers: Headers;
  responseData: MovieMappingResponse;
  isSuccess = true;
  error: string;
  movieList: MovieDropDownModel[] = [];
  selectedMovie: MovieDropDownModel;
  cineastList: MovieDropDownModel[] = [];
  selectedCineast: MovieDropDownModel;
  roleList: MovieDropDownModel[] = [];
  selectedRole: RoleDropDownModel[] = [];
  displayList: MovieDropDownModel[] = [];
  selectedDisplay: MovieDropDownModel[] = [];
  displaySave: boolean = false;
  displayOrders: Array<number>;

  summarySelection = false;
  selectedmovieid: any;
  selectedcineastid: any;
  selectedroleid: any;
  selectedDisplayOrder: any;
  dataSource: any;
  showMovie = false;
  classSummaryDisplaycolumns = ["cineastName", "roleName", "roleType", "displayOrder"];
  classDataSource: any;
  ioObjArray: DisplayMovie[] = [];

  constructor(
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private log: LogService

  ) { }

  ngOnInit() {
    this.getAllMovie();
  }

  onMovieChange(movie: MovieDropDownModel) {
    this.displaySave = false;
    localStorage.setItem("cineastmovieid", JSON.stringify(movie.id));
    this.log.info('selected local storge movie is :: ' + movie.id);
    this.getCineastAndRoleBasedOnMovie();
    this.getAllCineast();
    this.summarySelection = false;
  }



  private getAllMovie() {
    this.movieList = [];
    this.cineastList = [];
    this.roleList = [];
    this.classDataSource = new MatTableDataSource(this.cineastList);
    let movieRequest = <MovieHeader>{};
    movieRequest.header = this.header;
    this.restService
      .post(movieRequest, environment.getAllMoviePath)
      .map((movie: any) => {
        if (movie) {
          movie.movies.forEach(erg => {
            this.movieList.push(
              new MovieDropDownModel(erg.movieId, erg.movieName)
            );
          });
        }
      })
      .subscribe(
        result => { },
        err => { }
      );
  }


  private getCineastAndRoleBasedOnMovie(): any {
    this.displaySave = false;
    this.classDataSource = new MatTableDataSource(this.movieList);
    let movieRequest = <getMovieRequest>({});
    movieRequest.header = this.header;
    this.selectedmovieid = localStorage.getItem("cineastmovieid");
    movieRequest.movieId = this.selectedmovieid;
    this.restService.post(movieRequest, environment.getCineastMovie)
      .map((response: any) => {
        const result: Array<CineastDetails> = [];
        if (response) {
          if (response.movieCineasts.length > 0) {
            for (let cineastArr of response.movieCineasts) {
              this.showMovie = true;
              cineastArr.cineastDetails.forEach(erg => {
                const obj = new CineastDetails(erg.cineastId, erg.cineastName, erg.profileImage, erg.roleId, erg.roleName, erg.roleType,
                  erg.roleDescription, erg.displayOrder
                );
                result.push(obj);
              });
            }
          }
          else {
            this.showMovie = false;
          }
        }
        return result;
      })
      .subscribe(result => {
        this.dataSource = new MatTableDataSource(result);
      })
  }

  onCineastChange(cineast: MovieDropDownModel) {
    this.displaySave = false;
    localStorage.setItem("cineastmemberid", JSON.stringify(cineast.id));
    this.getAllRole();
    this.summarySelection = false;
  }

  getAllCineast() {
    this.cineastList = [];
    this.roleList = [];
    this.displayList = [];
    let movieRequest = <MovieHeader>({});
    movieRequest.header = this.header;
    this.restService
      .post(movieRequest, environment.getAllCineastMember)
      .map((cineast: any) => {
        if (cineast) {
          cineast.cineasts.forEach(erg => {
            this.cineastList.push(
              new MovieDropDownModel(erg.cineastId, erg.cineastName)
            );
          });
        }
      })
      .subscribe(
        movieList => { },
        err => { }
      );
  }

  onRoleChange(role: RoleDropDownModel) {
    this.displaySave = true;
    this.log.info('selected Role is :: ' + role.name);
    localStorage.setItem("cineastroleid", JSON.stringify(role.id));
    this.displayOrders = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    this.displayOrderBasedOnMovie(role.type);
    this.summarySelection = false;
  }

  getAllRole() {
    this.roleList = [];
    this.displayList = [];
    let movieRequest = <MovieHeader>({});
    movieRequest.header = this.header;
    this.restService
      .post(movieRequest, environment.getAllCineastRole)
      .map((role: any) => {
        if (role) {
          role.roles.forEach(erg => {
            this.roleList.push(
              new RoleDropDownModel(erg.roleId, erg.roleName, erg.roleType)
            );
          });
        }
      })
      .subscribe(
        screenResult => { },
        err => { }
      );
  }

  displayOrderBasedOnMovie(typevalue) {
    this.displaySave = true;
    let movieRequest = <getMovieRequest>({});
    movieRequest.header = this.header;
    this.selectedmovieid = localStorage.getItem("cineastmovieid");
    movieRequest.movieId = this.selectedmovieid;
    this.restService.post(movieRequest, environment.getCineastMovie)
      .map((response: any) => {
        if (response) {
          for (let cineastArr of response.movieCineasts) {
            console.log("Display Order Movie" + JSON.stringify(cineastArr.cineastDetails));
            for (let dOrder of cineastArr.cineastDetails) {
              if (dOrder.roleType === typevalue) {
                this.displayOrders = this.displayOrders.filter(x => (x !== dOrder.displayOrder));
                console.log(this.displayOrders)
              }

            }
          }

        }
      })
      .subscribe(
        screenResult => { },
        err => { }
      );

  }

  displayOrder(event: any) {
    this.displaySave = true;
    console.log("Display Order" + event.value);
    localStorage.setItem("cineastdisplayorder", JSON.stringify(event.value));
  }



  /* Save Details**/
  public saveDetail() {
    this.log.info('SAVE METHOD');
    let validationMessage = this.validation();
    if (validationMessage === false) {
      this.save();
    } else {
      this.openSnackBar("Please fill the red marked fields", validationMessage);
    }
  }

  private save() {
    const request = <MovieMappingDetails>{};
    request.header = this.header;
    this.selectedmovieid = localStorage.getItem("cineastmovieid");
    this.selectedcineastid = localStorage.getItem("cineastmemberid");
    this.selectedroleid = localStorage.getItem("cineastroleid");
    this.selectedDisplayOrder = localStorage.getItem("cineastdisplayorder")
    request.cineastId = this.selectedcineastid;
    request.movieId = this.selectedmovieid;
    request.roleId = this.selectedroleid;
    request.displayOrder = this.selectedDisplayOrder;
    this.restService
      .post(request, environment.getCineastMovieAdd)
      .map((movie: any) => {
        this.log.info('SAVE****');
        let result: MovieMappingResponse;
        result = new MovieMappingResponse(
          movie.status['statusCode'],
          movie.status['statusDescription'],
          movie.status['transactionId']
        );
        return result;
      })
      .subscribe(
        result => {
          this.log.info(
            'inside response' +
            result.statusCode +
            '' +
            result.statusDescription +
            '' +
            result.transactionId
          );
          this.responseData = result;
          this.log.info(this.responseData);
          if ((this.responseData.statusCode == '1001')) {
            this.isSuccess = true;
            this.router.navigate(['/movie-mapping']);
            this.ngOnInit();
          } else if ((this.responseData.statusCode == '1002')) {
            this.openSnackBar(this.responseData.statusDescription, "error");
          } else {
            this.openSnackBar(result.statusDescription, "error");
          }
        }

      );
  }
  validation() {
    if (this.selectedmovieid == '') {
      return 'Moive Name is required!';
    }
    if (this.selectedCineast.name == '') {
      return 'Cineast Name is required!';
    }
    else {
      return false;
    }
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  myErrorStateMatcher(): boolean {
    return true;
  }

}
