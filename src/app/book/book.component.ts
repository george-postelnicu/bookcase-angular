import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Book } from "../models/book";
import { BookService } from "../book.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'book',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BookService);
  private readonly location = inject(Location);

  readonly book = toSignal<Book | null>(
    this.bookService.getBook(Number(this.route.snapshot.paramMap.get('id'))),
    { initialValue: null }
  );

  goBack(): void {
    this.location.back();
  }
}
