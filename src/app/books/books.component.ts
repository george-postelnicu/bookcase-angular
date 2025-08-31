import { Component, OnInit, inject } from '@angular/core';
import { AsyncPipe } from "@angular/common";
import {BookService} from "../book.service";
import {debounceTime, distinctUntilChanged, EMPTY, Observable, startWith, Subject, switchMap, tap} from "rxjs";
import {RouterLink} from "@angular/router";
import {PagedBooks} from "../models/paged-books";

@Component({
  selector: 'books',
  imports: [
    RouterLink,
    AsyncPipe
  ],
  templateUrl: './books.component.html',
  standalone: true,
  styleUrl: './books.component.css'
})
export class BooksComponent implements OnInit {
  private bookService = inject(BookService);

  books$!: Observable<PagedBooks>;
  filteredBooks$!: Observable<PagedBooks>;
  private searchTerms: Subject<string> = new Subject<string>();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
  }

  ngOnInit(): void {
    this.books$ = this.searchTerms.pipe(
      startWith(""),
      debounceTime(500),
      distinctUntilChanged(),
      tap((value: string) => console.log(`Value searched [${value}]`)),
      switchMap((value: string) => {
        if (value.trim() === '') {
          return this.bookService.getBooks();
        } else if (value.trim().length > 2) {
          return this.bookService.searchBooks(value);
        } else {
          return EMPTY;
        }
      })
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }
}
