import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'books', loadComponent: () => import('./books/books.component').then(m => m.BooksComponent) },
  { path: 'books/:id', loadComponent: () => import('./book/book.component').then(m => m.BookComponent) },
  { path: '', redirectTo: '/books', pathMatch: 'full' },
  { path: '**', loadComponent: () => import('./page-not-found/page-not-found.component').then(m => m.PageNotFoundComponent) }
];
