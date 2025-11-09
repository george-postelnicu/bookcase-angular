import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { BookService } from "../book.service";
import { emptyResult, PagedBooks } from "../models/paged-books";
import { finalize, take } from "rxjs";

@Component({
  selector: 'books',
  imports: [
    RouterLink
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BooksComponent {
  private readonly bookService = inject(BookService);

  // state
  readonly term = signal<string>('');
  readonly books = signal<PagedBooks>(emptyResult);
  readonly loading = signal<boolean>(false);
  readonly validationError = signal<string | null>(null);

  constructor() {
    // Load all books initially
    this.fetchAll();
  }

  onSubmit(term: string): void {
    this.term.set(term);

    // Validation: require at least 3 characters
    if (term.length < 3) {
      this.validationError.set('Please enter at least 3 characters.');
      this.books.set(emptyResult);
      return;
    }

    this.validationError.set(null);
    this.loading.set(true);

    this.bookService
      .searchBooks(term)
      .pipe(
        take(1),
        finalize(() => this.loading.set(false))
      )
      .subscribe((res) => this.books.set(res));
  }

  onReset(): void {
    this.term.set('');
    this.validationError.set(null);
    this.fetchAll();
  }

  private fetchAll(): void {
    this.loading.set(true);
    this.bookService
      .getBooks()
      .pipe(
        take(1),
        finalize(() => this.loading.set(false))
      )
      .subscribe((res) => this.books.set(res));
  }
}
