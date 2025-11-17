import { Injectable, inject } from '@angular/core';
import {Book} from "./models/book";
import {catchError, Observable, of, tap} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {emptyResult, PagedBooks} from "./models/paged-books";
import {CoverType} from "./models/cover-type";

export interface BookSearchParams {
  page?: number;
  size?: number;
  name?: string | null;
  full_title?: string | null;
  description?: string | null;
  isbn?: string | null;
  barcode?: string | null;
  authors?: string[] | null;
  keywords?: string[] | null;
  languages?: string[] | null;
  publisher?: string | null;
  cover_type?: CoverType | null;
  min_year?: number | null;
  max_year?: number | null;
  min_pages?: number | null;
  max_pages?: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private http = inject(HttpClient);

  private readonly booksUrl: string = "api/books";

  getBooks(): Observable<PagedBooks> {
    return this.http.get<PagedBooks>(this.booksUrl)
      .pipe(
        tap(_ => console.log('fetched all books')),
        catchError(this.handleError<PagedBooks>('getBooks', emptyResult))
      );
  }

  getBook(id: number): Observable<Book> {
    const url: string = `${this.booksUrl}/${id}`;
    return this.http.get<Book>(url).pipe(
      tap(_ => console.log('fetched a book')),
      catchError(this.handleError<Book>(`getBook id=${id}`))
    );
  }

  search(params: BookSearchParams): Observable<PagedBooks> {
    let httpParams = new HttpParams();
    const append = (key: string, value: string | number | boolean) => {
      httpParams = httpParams.append(key, String(value));
    };

    if (params.page != null) append('page', params.page);
    if (params.size != null) append('size', params.size);

    const simpleKeys: Array<keyof BookSearchParams> = [
      'name', 'full_title', 'description', 'isbn', 'barcode', 'publisher'
    ];
    simpleKeys.forEach(k => {
      const v = params[k];
      if (v != null && v !== '') append(k as string, v as string);
    });

    if (params.cover_type != null) append('cover_type', params.cover_type);
    if (params.min_year != null) append('min_year', params.min_year);
    if (params.max_year != null) append('max_year', params.max_year);
    if (params.min_pages != null) append('min_pages', params.min_pages);
    if (params.max_pages != null) append('max_pages', params.max_pages);

    const arrayKeys: Array<keyof BookSearchParams> = ['authors', 'keywords', 'languages'];
    arrayKeys.forEach(k => {
      const arr = params[k] as string[] | null | undefined;
      if (arr && arr.length) {
        arr.forEach(v => { if (v && v.trim()) httpParams = httpParams.append(k as string, v.trim()); });
      }
    });

    return this.http.get<PagedBooks>(this.booksUrl, { params: httpParams })
      .pipe(
        tap(_ => console.log(`searched for books matching ${JSON.stringify(params)}`)),
        catchError(this.handleError<PagedBooks>('search', emptyResult)));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: unknown): Observable<T> => {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`${operation} failed: ${message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
