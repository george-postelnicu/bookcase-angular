import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {BookService} from "../book.service";
import {debounceTime, distinctUntilChanged, EMPTY, Observable, startWith, Subject, switchMap, tap} from "rxjs";
import {RouterLink} from "@angular/router";
import {PagedBooks} from "../models/paged-books";

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
  filteredBooks$!: Observable<PagedBooks>;
  private searchTerms: Subject<string> = new Subject<string>();

  constructor(private bookService: BookService) {
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
