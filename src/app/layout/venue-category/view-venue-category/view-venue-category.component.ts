import { Component, OnInit } from '@angular/core';
import { VenueCategory } from '../venue-category';
import { TempDataService } from '../../../shared/temp-dataStore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl } from '@angular/forms';
import { UUID } from '../../../shared/services/uuid';
import { Headers } from '../../../shared/model/request-header';
import { LogService } from '../../../shared/services/log.service';
import { Header } from '../../../shared/services/header';

@Component({
  selector: 'app-view-venue-category',
  templateUrl: './view-venue-category.component.html',
  styleUrls: ['./view-venue-category.component.scss']
})
export class ViewVenueCategoryComponent implements OnInit {
  data: any;
  selectedData: VenueCategory;
  headers: Headers;
  header = new Header(UUID.UUID());
  buttonStatus: boolean;

  constructor(private tempDataService: TempDataService,
    public snackBar: MatSnackBar, private log: LogService) { }
  myControl: FormControl = new FormControl();

  clear() {

    let venueCategoryValue = <VenueCategory>({
      synopsis: '',
      venueCategoryName: ''
    });
    this.selectedData = venueCategoryValue;
  }
  ngOnInit() {
    
    this.headers = <Headers>{
      header: this.header
    }
    this.log.info("EDIT METHOD");
    this.tempDataService.currentSelectedData.subscribe(selectedData => this.selectedData = selectedData);
    this.buttonStatus = this.selectedData.editable;
    this.log.info("EDIT METHOD=====" + JSON.stringify(this.selectedData));
    JSON.stringify(this.selectedData);
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
  myErrorStateMatcher(): boolean {
    return true;
  }

  editStatus() {
    if (this.buttonStatus) {
      this.buttonStatus = false;
    }


  }


}