import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';
import { AddMovieRoutingModule } from './add-movie-routing.module';
import { AddMovieComponent } from './add-movie.component';
import { AddMovieFilterPipe } from './add-movie.pipes';
import { DatePickerModule } from '../../../shared/modules/date-picker/date-picker.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    CommonModule,
    DatePickerModule,
    AddMovieRoutingModule],
  providers: [ TempDataService],
  declarations: [AddMovieComponent,AddMovieFilterPipe]
})
export class AddMovieModule { }
