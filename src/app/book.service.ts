import {Injectable} from '@angular/core';
import {Book} from "./book/book";
import {
  conflictsAndAdaptations,
  landscapesOfIdentity, oneHundredFiftyHouses,
  oneHundredStepsThrough20thCenturyEstonianArchitecture
} from "./book/book-data-common";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  constructor() {
  }

  private _books: Book[] = [
    landscapesOfIdentity(),
    conflictsAndAdaptations(),
    oneHundredStepsThrough20thCenturyEstonianArchitecture(),
    oneHundredFiftyHouses()
  ];
  getBooks(): Observable<Book[]> {
    return of(this._books);
  }

  getBook(id: number): Observable<Book> {
    let foundBook = this._books.find(book => book.id === id)!;
    return of(foundBook);
  }

}
