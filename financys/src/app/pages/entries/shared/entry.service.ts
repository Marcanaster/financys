import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError, observable } from 'rxjs';
import { map, catchError, flatMap } from "rxjs/operators";

import { Entry } from "./entry.model";



@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath: string = 'api/categories';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Entry[]>{
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    )
  }

  getById(id: number): Observable<Entry>{
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory )
    )
  }

  create(entry: Entry): Observable<Entry>{

    return this.http.post(this.apiPath, entry).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory )
    )
  }

  update(entry: Entry): Observable<Entry>{
    const url = `${this.apiPath}/${entry.id}`;

    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      map(() => entry)
    )
  }


  delete(id: number): Observable<boolean>{
    const url = `${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => true)
    )
  }
  private jsonDataToCategory(jsonData: any): Entry{
    return jsonData as Entry;
  }
  private jsonDataToCategories(jsonData: any[]): Entry[]{
    const categorias: Entry[] = [];
    jsonData.forEach(element => categorias.push(element as Entry));
    return categorias;
  }

  private handleError(error: any): Observable<any>{
    console.log('Erro na requisição =>', error);
    return throwError(error);
  }
}
