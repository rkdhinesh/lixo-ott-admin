import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CityRoutingModule } from './city-routing.module';
import { CityComponent } from './city.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../shared';
import { AddCityModule } from './add-city/add-city.module';
import { EditCityModule } from './edit-city/edit-city.module';
import { ViewCityModule } from './view-city/view-city.module';
import { TempDataService } from '../../shared/temp-dataStore';
import { MaterialModule } from '../../shared/components/MaterialModule';


@NgModule({
  declarations: [CityComponent],
  providers: [TempDataService],
  imports: [
    CommonModule,
    RouterModule,
    CityRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    PageHeaderModule,
    AddCityModule,
    EditCityModule,
    ViewCityModule
  ]
})
export class CityModule { }
