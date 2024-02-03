import { Component, OnInit } from '@angular/core';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from '../../../shared/services/log.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Header } from '../../../shared/services/header';
import { UUID } from '../../../shared/services/uuid';
import { environment } from '../../../../environments/environment';
import { AddCineastMember } from './add-cineast-member';
import { CineastMemberResponse } from '../cineast-memberResponse';


@Component({
  selector: 'app-add-cineast-member',
  templateUrl: './add-cineast-member.component.html',
  styleUrls: ['./add-cineast-member.component.scss']
})
export class AddCineastMemberComponent implements OnInit {
  data: any;
  selectedData: AddCineastMember;
  header = new Header(UUID.UUID());
  headers: Headers;
  responseData: CineastMemberResponse;
  isSuccess = true;
  error: string;
  cineastType: string;

  constructor(
    private restService: RestService,
    private route: ActivatedRoute,
    private router: Router,
    public snackBar: MatSnackBar,
    private log: LogService

  ) { }

  ngOnInit() {
    this.AddCineastValues();
  }

  AddCineastValues() {
    const AddCineastValue = <AddCineastMember>{
      cineastName: '',
      profileImage: '',

    };
    this.selectedData = AddCineastValue;
  }

  /* Save Details**/

  public saveDetail() {
    this.log.info('SAVE METHOD');
    this.error = this.validation();
    if (this.error === 'false') {
      this.save();
    } else {
      this.openSnackBar('Error: ', this.error);
    }
  }
  private save() {
    const request = <AddCineastMember>{};
    request.header = this.header;
    request.cineastName = this.selectedData.cineastName;
    request.profileImage = this.selectedData.profileImage;


    this.restService
      .post(request, environment.addCineastMember)
      .map((movie: any) => {
        this.log.info('SAVE****');
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
          if ((this.responseData.statusCode = '1001')) {
            this.isSuccess = true;
            this.openSnackBar(
              'Successfully Saved',
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
            this.openSnackBar('Cineast Name Already Exits', this.selectedData.cineastName
            );
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
      return 'Cineast is required!';
    } else if (this.selectedData.profileImage === '') {
      return 'ImageUrl is required!';
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
}
