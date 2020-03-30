import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { Category } from "../../categories/shared/category.model";
import { CategoryService } from "../../categories/shared/category.service";

import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { switchMap  } from "rxjs/operators";

import toastr from "toastr";

@Component({
  selector: 'app-entries-form',
  templateUrl: './entries-form.component.html',
  styleUrls: ['./entries-form.component.scss']
})
export class EntriesFormComponent implements OnInit {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErroMessages: string[] = null;
  submitttingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };
  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado' ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out','Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formbulider: FormBuilder,
    private categoryService: CategoryService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntries();
    this.loadCategories();
  }


  ngAfterContentChecked() {
    this.setPageTitle()
  }

  private buildEntryForm() {
    this.entryForm = this.formbulider.group({
      id: [null],
      name: [null,[Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }
  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == 'new')
      this.currentAction = 'new';
    else
      this.currentAction = 'edit'
  }



  submitForm(){
    this.submitttingForm = true;

    if(this.currentAction == 'new')
      this.createEntry();
    else
      this.updateEntry();
  }

  get typeOptions() : Array<any>{
    return Object.entries(Entry.types).map(
      ([value, text])=> {
        return {
          text: text,
          value: value
        }
      }
    )
  }
  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.update(entry)
    .subscribe(
      entry => this.actionForSuccess(entry),
      error => this.actionForError(error)
    )
  }
  private createEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
    this.entryService.create(entry)
    .subscribe(
      entry => this.actionForSuccess(entry),
      error => this.actionForError(error)
    )
  }
  private actionForError(error) {
    toastr.error(('Ocorreu um erro ao processor a sua solicitação !'));
    this.submitttingForm = false;
    if(error.status === 422 )
      this.serverErroMessages = JSON.parse(error._body).errors;
    else
      this.serverErroMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.']
  }
  private actionForSuccess(entry: Entry){
    toastr.success('Solicitação processada com sucesso.')
    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    )
  }
  private setPageTitle() {
    if(this.currentAction == 'new'){
      this.pageTitle = 'Cadastrando';
    }
    else {
      const entryName = this.entry.name || "";
      this.pageTitle = `Editando: ${entryName}`;
    }
  }

  private loadEntries() {
    if(this.currentAction == 'edit'){
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(entry);
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde.')
      )
    }
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }
}
