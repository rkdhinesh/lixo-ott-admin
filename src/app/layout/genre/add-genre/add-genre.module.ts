import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddGenreComponent } from './add-genre.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderModule } from '../../../shared';
import { MaterialModule } from '../../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AddGenreRoutingModule } from './add-genre-routing.module';
import { TempDataService } from '../../../shared/temp-dataStore';

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
    AddGenreRoutingModule],
  providers: [ TempDataService],
  declarations: [AddGenreComponent]
})
export class AddGenreModule { }
