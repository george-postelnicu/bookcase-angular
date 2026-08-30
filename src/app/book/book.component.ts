import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Book } from '../models/book';
import { BookService } from '../book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { catchError, Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-book',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatDividerModule, MatChipsModule],
  templateUrl: './book.component.html',
  styleUrl: './book.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly bookService = inject(BookService);
  private readonly location = inject(Location);

  readonly book = toSignal<Book | null>(this.loadBook(), { initialValue: null });

  goBack(): void {
    this.location.back();
  }

  private loadBook(): Observable<Book | null> {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);
    if (!idParam || isNaN(id) || id <= 0) {
      this.router.navigate(['/page-not-found']);
      return of(null);
    }

    return this.bookService.getBook(id).pipe(
      tap((book) => {
        if (!book || !book.id) {
          this.router.navigate(['/page-not-found']);
        }
      }),
      catchError(() => {
        this.router.navigate(['/page-not-found']);
        return of(null);
      }),
    );
  }
}
