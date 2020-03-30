import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CategoriesModule } from './pages/categories/categories.module';
import { EntriesModule } from "./pages/entries/entries.module";


const routes: Routes = [
  { path: 'entries', loadChildren: () => EntriesModule },
  { path: 'categories', loadChildren: () => CategoriesModule}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
