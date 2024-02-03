import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyPageComponent } from './company-page.component';
import { PageHeaderModule } from '../../shared';
import { MaterialModule } from '../../shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { CompanyRoutingModule } from './company-page-routing.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TempDataService } from '../../shared/temp-dataStore';
import { EditCompanyModule } from './edit/edit-company.module';
import { CompanyFilterPipe } from './company.pipes';
import { ViewCompanyModule } from './view-company/view-company.module';
import { LixoDataTableModule } from '../../../app/shared/modules/lixo-data-table/lixo-data-table.module';
@NgModule({
  imports: [
    CommonModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    CompanyRoutingModule,
    EditCompanyModule,
    ViewCompanyModule,
    FlexLayoutModule,
    FormsModule,
    LixoDataTableModule
  ],
  providers: [TempDataService],
  declarations: [CompanyPageComponent, CompanyFilterPipe],
})
export class CompanyPageModule { }
