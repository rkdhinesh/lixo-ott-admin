import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderModule } from 'app/shared';
import { MaterialModule } from 'app/shared/components/MaterialModule';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { TempDataService } from 'app/shared/temp-dataStore';
import { CineastMemberRoutingModule } from './cineast-member-routing.module';
import { EditCineastMemberModule } from './edit-cineast-member/edit-cineast-member.module';
import { CineastMemberComponent } from './cineast-member.component';

@NgModule({
  declarations: [CineastMemberComponent],
  imports: [
    CommonModule,
    PageHeaderModule,
    MaterialModule,
    RouterModule,
    CineastMemberRoutingModule,
    EditCineastMemberModule,
    FlexLayoutModule,
    FormsModule,
  ], providers: [TempDataService],
})
export class CineastMemberModule { }
