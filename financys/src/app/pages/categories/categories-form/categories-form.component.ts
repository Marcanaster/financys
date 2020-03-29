import { Category } from './../shared/category.model';
import { CategoryService } from './../shared/category.service';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { switchMap  } from "rxjs/operators";

import toastr from "toastr";

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErroMessages: string[] = null;
  submitttingForm: boolean = false;
  category: Category = new Category();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private formbulider: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle()
  }

  private loadCategory() {
    if(this.currentAction == 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      )
      .subscribe(
        (category) => {
          this.category = category;
          this.categoryForm.patchValue(category);
        },
        (error) => alert('Ocorreu um erro no servidor, tente amsi tarde.')
      )
    }
  }

  private buildCategoryForm() {
    this.categoryForm = this.formbulider.group({
      id: [null],
      name: [null,[Validators.required, Validators.minLength(2)]],
      description: [null]
    })
  }
  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new';
    else
      this.currentAction = 'edit'
  }



  submitForm(){
    debugger
    this.submitttingForm = true;

    if(this.currentAction == 'new')
      this.createCategory();
    else
      this.updateCategory();
  }
  private updateCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.update(category)
    .subscribe(
      category => this.actionForSuccess(category),
      error => this.actionForError(error)
    )
  }
  private createCategory() {
    const category: Category = Object.assign(new Category(), this.categoryForm.value);
    this.categoryService.create(category)
    .subscribe(
      category => this.actionForSuccess(category),
      error => this.actionForError(error)
    )
  }
  private actionForError(error: any) {
    toastr.console.error(('Ocorreu um erro ao processor a sua solicitação !'));
    this.submitttingForm = false;
    if(error.status === 422 )
      this.serverErroMessages = JSON.parse(error._body).errors;
    else
      this.serverErroMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.']
  }
  private actionForSuccess(category: Category){
    toastr.success('Solicitação processada com sucesso.')
    this.router.navigateByUrl('categories', {skipLocationChange: true}).then(
      () => this.router.navigate(['categories', category.id, 'edit'])
    )
  }
  private setPageTitle() {
    if(this.currentAction == 'new'){
      this.pageTitle = 'Cadastro de nova categoria';
    }
    else {
      const categoryName = this.category.name || "";
      this.pageTitle = `Editando a categoria: ${categoryName}`;
    }
  }
}
