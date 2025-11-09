import { Injectable, inject } from '@angular/core';
import {Book} from "./models/book";
import {catchError, Observable, of, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {emptyResult, PagedBooks} from "./models/paged-books";

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

  searchBooks(term: string): Observable<PagedBooks> {
      return this.http.get<PagedBooks>(`${this.booksUrl}/?name=${term}`).pipe(
        catchError(this.handleError<PagedBooks>('searchBooks', emptyResult))
      );
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
