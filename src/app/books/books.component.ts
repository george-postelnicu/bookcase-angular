import {Component, OnInit} from '@angular/core';
import {Book} from "../book/book";
import {AsyncPipe, NgForOf} from "@angular/common";
import {BookService} from "../book.service";
import {debounceTime, distinctUntilChanged, Observable, Subject, switchMap} from "rxjs";
import {RouterLink} from "@angular/router";
import {PagedBooks} from "../book/paged-books";

@Component({
  selector: 'books',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  books$!: Observable<PagedBooks>;
  private searchTerms: Subject<string> = new Subject<string>();

  constructor(private bookService: BookService) {
  }

  ngOnInit(): void {
    this.books$ = this.bookService.getBooks();
    /*this.books$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.bookService.searchBooks(term)),
    );*/
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }
}
