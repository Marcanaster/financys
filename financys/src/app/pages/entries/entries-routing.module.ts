import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EntriesListComponent } from "./entries-list/entries-list.component";


const routes: Routes = [
  { path: '', component: EntriesListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntriesRoutingModule { }
