import { CategoryService } from './../shared/category.service';
import { Component, OnInit } from '@angular/core';

import { Category } from "../shared/category.model";


@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  categories: Category[] = []

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {

    this.categoryService.getAll().subscribe(
      categories => this.categories = categories,
      error => alert('Erro ao carregar a lista')
    )
  }

  deleteCategory(category){

    let mustDelete = confirm(` Deseja excluir a categoria ${category.name} ?`);
    if(!mustDelete) return false;
    this.categoryService.delete(category.id).subscribe(
      () => this.categories = this.categories.filter(element => element != category),
      () => alert('Erro ao tentar excluir a categoria.')
    )
  }

}
