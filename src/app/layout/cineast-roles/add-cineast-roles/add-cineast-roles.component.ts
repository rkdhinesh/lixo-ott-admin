import { Component, OnInit } from '@angular/core';
import { RestService } from '../../../api.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../../environments/environment';
import { UUID } from '../../../shared/services/uuid';
import { Header } from '../../../shared/services/header';
import { LogService } from '../../../shared/services/log.service';
import { AddCineastRole } from './add-cineast-roles';
import { CineastRoleResponse } from '../cineast-roleResponse';
import { MatRadioChange } from '@angular/material/radio';

@Component({
  selector: 'app-add-cineast-roles',
  templateUrl: './add-cineast-roles.component.html',
  styleUrls: ['./add-cineast-roles.component.scss'],
})
export class AddCineastRolesComponent implements OnInit {
  data: any;
  selectedData: AddCineastRole;
  selectedType: Array<string>;

  header = new Header(UUID.UUID());
  headers: Headers;
  responseData: CineastRoleResponse;
  isSuccess = true;
  error: string;
  cineastType: string;

  constructor(
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private log: LogService
  ) { }

  ngOnInit() {
    this.AddCineastRoles();
    this.selectedType = ['CAST', 'CREW'];
  }

  AddCineastRoles() {
    const AddCineastRoleValue = <AddCineastRole>{
      roleName: '',
      roleDescription: '',
      roleType: '',
    };
    this.selectedData = AddCineastRoleValue;
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
    const request = <AddCineastRole>{};
    request.header = this.header;
    request.roleName = this.selectedData.roleName;
    request.roleDescription = this.selectedData.roleDescription;
    this.cineastType = localStorage.getItem('roletype');
    this.log.info('Save Local Storage:::::' + this.cineastType);
    request.roleType = this.cineastType;

    this.restService
      .post(request, environment.addCineastRole)
      .map((movie: any) => {
        this.log.info('SAVE****');
        let result: CineastRoleResponse;
        result = new CineastRoleResponse(
          movie.status['statusCode'],
          movie.status['statusDescription'],
          movie.status['transactionId']
        );
        return result;
      })
      .subscribe(
        (result) => {
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
            this.openSnackBar('Successfully Saved', this.selectedData.roleName);
            this.router.navigate(['/cineast-roles']);
            this.ngOnInit();
          } else if ((this.responseData.statusCode == '1002')) {
            this.openSnackBar(
              'Operation Failed',
              this.selectedData.roleName
            );
          }
          else if (this.responseData.statusCode == '1004') {
            this.openSnackBar('Role Name ALready Exits', this.selectedData.roleName);
          }
        },
        (err) => {
          const errorVal = err.status.statusDescription;
          this.openSnackBar('ERROR MSG', errorVal);
        }
      );
  }

  // Change Radio button
  radioChange(event: MatRadioChange) {
    console.log(event.value);
    localStorage.setItem('roletype', event.value);

    console.log('Local storage:' + event.value);
  }

  // Validation part
  validation() {
    if (this.selectedData.roleName === '') {
      return 'Cineast Role Name is required!';
    } else if (this.cineastType === '') {
      return 'Role type is required!';
    } else if (this.selectedData.roleDescription === '') {
      return 'Role Description is required!';
    } else {
      return 'false';
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  myErrorStateMatcher(): boolean {
    return true;
  }
}
