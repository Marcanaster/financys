import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from "@angular/forms";

import { CategoriesRoutingModule } from './categories-routing.module';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoriesFormComponent } from './categories-form/categories-form.component';


@NgModule({
  imports: [
    CommonModule,
    CategoriesRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CategoriesListComponent, CategoriesFormComponent]
})
export class CategoriesModule { }
