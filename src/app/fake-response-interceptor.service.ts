import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {ALL_BOOKS} from "./models/book-data-common";
import {PagedBooks} from "./models/paged-books";
import {Book} from "./models/book";
import {ErrorResponse} from "./models/error";

@Injectable()
export class FakeResponseInterceptor implements HttpInterceptor {
  private counter: number = 1;
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('api/books') && req.method == 'GET') {
      console.log(`Api call ${req.url} intercepted ${this.counter++}`)
      let fakeResponse: any = ALL_BOOKS;
      let status: number = 200;
      if ((req.url.match(/\//g) || []).length > 1) {
        const id: number = Number(req.url.substring(req.url.lastIndexOf("/") + 1));
        fakeResponse = this.getBook(id);
        if (id < 1 || id > 3) {
          status = 404;
        }
      }

      if (req.url.includes("?")) {
        fakeResponse = this.getBooks(req.url.substring(req.url.lastIndexOf("=") + 1));
      }

      return of(new HttpResponse({status: status, body: fakeResponse}));
    } else {
      return next.handle(req);
    }
  }

  getBook(id: number): Book | ErrorResponse {
    for (const book of ALL_BOOKS.content) {
      if (book.id == id) {
        return book;
      }
    }
    return {title: `Cannot find [BOOK] with [${id}]`};
  }

  getBooks(name: string): PagedBooks {
    const filteredBooks = ALL_BOOKS.content.filter(book => book.name.toLowerCase().includes(name.toLowerCase()));
    return {
      content: filteredBooks,
      pageable: ALL_BOOKS.pageable,
      totalPages: ALL_BOOKS.totalPages,
      totalElements: filteredBooks.length,
      last: ALL_BOOKS.last,
      first: ALL_BOOKS.first,
      size: ALL_BOOKS.size,
      number: ALL_BOOKS.number,
      sort: ALL_BOOKS.sort,
      numberOfElements: filteredBooks.length,
      empty: filteredBooks.length === 0
    };
  }
}
