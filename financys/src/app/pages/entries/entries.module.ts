import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { EntriesRoutingModule } from './entries-routing.module';

import { EntriesListComponent } from "./entries-list/entries-list.component";
import { EntriesFormComponent } from "./entries-form/entries-form.component";

import { CalendarModule } from "primeng/calendar";
import { IMaskModule } from "angular-imask";


@NgModule({
  declarations: [EntriesListComponent, EntriesFormComponent],
  imports: [
    CommonModule,
    EntriesRoutingModule,
    ReactiveFormsModule,
    CalendarModule,
    IMaskModule
  ]
})
export class EntriesModule { }
