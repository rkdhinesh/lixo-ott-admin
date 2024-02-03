import { Headers } from '../../../shared/model/request-header';
import { RestService } from '../../../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UUID } from '../../../shared/services/uuid';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { TempDataService } from '../../../shared/temp-dataStore';
import { environment } from '../../../../environments/environment';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';
import { CineastRoles } from '../cineast-roles';
import { CineastRoleResponse } from '../cineast-roleResponse';

export class CineastRolesRequest {
  header = new Header(UUID.UUID());
  roleDescription: string;
  roleId: number;
  roleName: string;
  roleType: string;
  constructor() { }
}

@Component({
  selector: 'app-edit-cineast-roles',
  templateUrl: './edit-cineast-roles.component.html',
  styleUrls: ['./edit-cineast-roles.component.scss']
})
export class EditCineastRolesComponent implements OnInit {
  headers: Headers;
  selectedData: CineastRoles;
  responseData: CineastRoleResponse;
  cineastType: string;
  selectedType: any;
  error: string;
  header = new Header(UUID.UUID());
  crewFlag: boolean;
  castFlag: boolean;
  castandFlag: any;

  constructor(
    private tempDataService: TempDataService,
    private restService: RestService,
    private router: Router,
    public snackBar: MatSnackBar,
    private log: LogService
  ) { }

  clear() {
    const cineastRole = <CineastRolesRequest>{
      roleDescription: '',
      roleId: 0,
      roleName: '',
      roleType: ''
    };
    this.selectedData = cineastRole;
  }

  ngOnInit() {
    this.headers = <Headers>{
      header: this.header
    };
    this.log.info('EDIT METHOD');
    this.tempDataService.currentSelectedData.subscribe(
      selectedData => (this.selectedData = selectedData)
    );
    if (this.selectedData.roleType == 'CAST') {
      this.castFlag = true;
      this.castandFlag = 'CAST';
    }
    else {
      this.crewFlag = true;
      this.castandFlag = 'CREW';
    }
  }

  /* Save Details**/
  public saveDetail() {
    this.log.info('SAVE METHOD');

    if (this.validation() === 'false') {
      this.save(this.selectedData);
    } else {
      this.openSnackBar('Please fill the red marked fields', 'all field');
    }
  }
  private save(data: any) {
    const request = <CineastRolesRequest>{};
    request.header = this.header;
    request.roleId = this.selectedData.roleId;
    request.roleName = this.selectedData.roleName;
    request.roleDescription = this.selectedData.roleDescription;
    request.roleType = this.castandFlag;
    this.restService
      .post(request, environment.updateCineastRole)
      .map((movie: any) => {
        this.log.info('UPDATE****');
        let result: CineastRoleResponse;
        result = new CineastRoleResponse(
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
              this.selectedData.roleName
            );
            this.router.navigate(['/cineast-roles']);
            this.ngOnInit();

          } else if ((this.responseData.statusCode == '1002')) {
            this.openSnackBar(
              'Updated Failed',
              this.selectedData.roleName
            );
          } else if (this.responseData.statusCode == '1004') {
            this.openSnackBar('Already Exits', this.selectedData.roleName);
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
    if (this.selectedData.roleName === '') {
      return 'Role Name is required!';
    } else if (this.selectedData.roleDescription === '') {
      return 'Role Description is required!';
    } else {
      return 'false';
    }
  }


  // Change Radio button
  radioChange(event: any) {
    console.log('radio 2:' + event.value);
    this.castandFlag = event.value;
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
