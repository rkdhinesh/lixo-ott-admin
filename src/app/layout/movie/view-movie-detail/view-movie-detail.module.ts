import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TempDataService } from '../../../shared/temp-dataStore';
import { ViewMovieDetailRoutingModule } from './view-movie-detail-routing.module';
import { ViewMovieDetailComponent } from './view-movie-detail.component';

@NgModule({
  imports: [
    CommonModule,
    ViewMovieDetailRoutingModule,
    FormsModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    FlexLayoutModule,
    ReactiveFormsModule,
  ],
  providers: [TempDataService],
  declarations: [ViewMovieDetailComponent]
})
export class ViewMovieDetailModule { }
