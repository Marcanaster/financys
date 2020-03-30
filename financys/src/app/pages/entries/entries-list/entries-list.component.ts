import { EntryService } from '../shared/entry.service';
import { Component, OnInit } from '@angular/core';

import { Entry } from "../shared/entry.model";


@Component({
  selector: 'app-entries-list',
  templateUrl: './entries-list.component.html',
  styleUrls: ['./entries-list.component.scss']
})
export class EntriesListComponent implements OnInit {

  entries: Entry[] = []

  constructor(private entryService: EntryService) { }

  ngOnInit() {

    this.entryService.getAll().subscribe(
      entries => this.entries = entries,
      error => alert('Erro ao carregar a lista')
    )
  }

  deleteEntry(entry){

    let mustDelete = confirm(` Deseja excluir esse item ${entry.name} ?`);
    if(!mustDelete) return false;
    this.entryService.delete(entry.id).subscribe(
      () => this.entries = this.entries.filter(element => element != entry),
      () => alert('Erro ao tentar excluir esse item.')
    )
  }

}
