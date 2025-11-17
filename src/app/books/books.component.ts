import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { BookService, BookSearchParams } from "../book.service";
import { emptyResult, PagedBooks } from "../models/paged-books";
import { finalize, take } from "rxjs";
import { CoverType } from "../models/cover-type";

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
  // no UI validations per requirements

  // Advanced filters state (simple comma-separated lists for multi-value fields)
  readonly fullTitle = signal<string>('');
  readonly description = signal<string>('');
  readonly isbn = signal<string>('');
  readonly barcode = signal<string>('');
  readonly authors = signal<string>('');
  readonly keywords = signal<string>('');
  readonly languages = signal<string>('');
  readonly publisher = signal<string>('');
  readonly coverType = signal<CoverType | ''>('');
  readonly minYear = signal<number | null>(null);
  readonly maxYear = signal<number | null>(null);
  readonly minPages = signal<number | null>(null);
  readonly maxPages = signal<number | null>(null);

  constructor() {
    // Load all books initially
    this.fetchAll();
  }

  onSubmit(): void {
    // Build params from signals (no validations; just gather and send)
    const toArray = (val: string) => val.split(',').map(v => v.trim()).filter(Boolean);
    const params: BookSearchParams = {
      name: this.term() || null,
      full_title: this.fullTitle() || null,
      description: this.description() || null,
      isbn: this.isbn() || null,
      barcode: this.barcode() || null,
      authors: this.authors() ? toArray(this.authors()) : null,
      keywords: this.keywords() ? toArray(this.keywords()) : null,
      languages: this.languages() ? toArray(this.languages()) : null,
      publisher: this.publisher() || null,
      cover_type: this.coverType() || null,
      min_year: this.minYear(),
      max_year: this.maxYear(),
      min_pages: this.minPages(),
      max_pages: this.maxPages()
    };

    // Always perform search with gathered params
    this.loading.set(true);
    this.bookService
      .search(params)
      .pipe(
        take(1),
        finalize(() => this.loading.set(false))
      )
      .subscribe(res => this.books.set(res));
  }

  onReset(): void {
    this.term.set('');
    this.fullTitle.set('');
    this.description.set('');
    this.isbn.set('');
    this.barcode.set('');
    this.authors.set('');
    this.keywords.set('');
    this.languages.set('');
    this.publisher.set('');
    this.coverType.set('');
    this.minYear.set(null);
    this.maxYear.set(null);
    this.minPages.set(null);
    this.maxPages.set(null);
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
