import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import {Book} from "../models/book";
import {BookService} from "../book.service";
import {ActivatedRoute} from "@angular/router";
import { Location } from "@angular/common";
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'book',
  imports: [],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookComponent {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private location = inject(Location);

  readonly book = toSignal<Book | null>(
    this.bookService.getBook(Number(this.route.snapshot.paramMap.get('id'))),
    { initialValue: null }
  );

  goBack(): void {
    this.location.back();
  }
}
