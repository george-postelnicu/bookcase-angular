import {Injectable} from '@angular/core';
import {Book} from "./book/book";
import {catchError, Observable, of, tap} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {emptyResult, PagedBooks} from "./book/paged-books";

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly heroesUrl: string = "api/books";

  constructor(private http: HttpClient) {
  }

  getBooks(): Observable<PagedBooks> {
    return this.http.get<PagedBooks>(this.heroesUrl)
      .pipe(
        tap(_ => console.log('fetched all heroes')),
        catchError(this.handleError<PagedBooks>('getBooks', undefined))
      );
  }

  getBook(id: number): Observable<Book> {
    const url: string = `${this.heroesUrl}/${id}`;
    return this.http.get<Book>(url).pipe(
      tap(_ => console.log('fetched a hero')),
      catchError(this.handleError<Book>(`getBook id=${id}`))
    );
  }

  searchBooks(term: string): Observable<PagedBooks> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of(emptyResult);
    }
    return this.http.get<PagedBooks>(`${this.heroesUrl}/?name=${term}`).pipe(
      catchError(this.handleError<PagedBooks>('searchBooks', emptyResult))
    );
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
