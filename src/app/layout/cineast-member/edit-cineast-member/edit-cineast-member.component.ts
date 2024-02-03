import { Headers } from '../../../shared/model/request-header';
import { Component, OnInit } from '@angular/core';
import { CineastMember } from '../cineast-member';
import { CineastMemberResponse } from '../cineast-memberResponse';
import { UUID } from '../../../shared/services/uuid';
import { TempDataService } from '../../../shared/temp-dataStore';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';
import { environment } from '../../../../environments/environment';

export class CineastMemberRequest {
  header = new Header(UUID.UUID());
  cineastId: number;
  cineastName: string;
  profileImage: string;
  constructor() { }
}

@Component({
  selector: 'app-edit-cineast-member',
  templateUrl: './edit-cineast-member.component.html',
  styleUrls: ['./edit-cineast-member.component.scss']
})
export class EditCineastMemberComponent implements OnInit {
  headers: Headers;
  selectedData: CineastMember;
  responseData: CineastMemberResponse;

  error: string;
  header = new Header(UUID.UUID());
  constructor(
    private tempDataService: TempDataService,
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private log: LogService
  ) { }

  clear() {
    const cineastMember = <CineastMemberRequest>{

      cineastId: 0,
      cineastName: '',
      profileImage: ''
    };
    this.selectedData = cineastMember;
  }

  ngOnInit() {
    this.headers = <Headers>{
      header: this.header
    };

    this.log.info('EDIT METHOD');
    this.tempDataService.currentSelectedData.subscribe(
      selectedData => (this.selectedData = selectedData)
    );
  }
  public saveDetail() {
    this.log.info('SAVE METHOD');
    this.error = this.validation();
    if (this.error === 'false') {
      this.save(this.selectedData);
    }
    else {
      this.openSnackBar('Please fill the red marked fields', 'all field');
    }
  }
  private save(data: any) {
    const request = <CineastMemberRequest>{};
    request.header = this.header;
    request.cineastId = this.selectedData.cineastId;
    request.cineastName = this.selectedData.cineastName;
    request.profileImage = this.selectedData.profileImage;

    this.restService
      .post(request, environment.updateCineastMember)
      .map((movie: any) => {
        this.log.info('UPDATE****');
        let result: CineastMemberResponse;
        result = new CineastMemberResponse(
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
            this.openSnackBar(
              'Successfully updated',
              this.selectedData.cineastName
            );
            this.router.navigate(['/cineast-member']);
            this.ngOnInit();
          } else if ((this.responseData.statusCode == '1002')) {
            this.openSnackBar(
              'Operation Failed',
              this.selectedData.cineastName
            );
          }
          else if (this.responseData.statusCode == '1004') {
            this.openSnackBar('Already Exits', this.selectedData.cineastName);
          }
        },
        err => {
          const errorVal = err.status.statusDescription;
          this.openSnackBar('ERROR MSG', errorVal);
        }
      );
  }

  // Validation part

  validation() {
    if (this.selectedData.cineastName === '') {
      return 'Cineast Name is required!';
    } else if (this.selectedData.profileImage === '') {
      return 'Profile Image is required!';
    } else {
      return 'false';
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

  /******************* Mat chips coding Start *********************/

  /******************* Mat chips coding End *********************/

  editStatus() { }
}
