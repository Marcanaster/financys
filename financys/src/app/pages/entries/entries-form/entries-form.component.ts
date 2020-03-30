import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validator, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { switchMap  } from "rxjs/operators";

import toastr from "toastr";

@Component({
  templateUrl: './entries-form.component.html',
  styleUrls: ['./entries-form.component.scss']
})
export class EntryFormComponent implements OnInit {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErroMessages: string[] = null;
  submitttingForm: boolean = false;
  entry: Entry = new Entry();

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formbulider: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntries();
  }

  ngAfterContentChecked() {
    this.setPageTitle()
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

  private buildEntryForm() {
    this.entryForm = this.formbulider.group({
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
    this.submitttingForm = true;

    if(this.currentAction == 'new')
      this.createEntry();
    else
      this.updateEntry();
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
}
