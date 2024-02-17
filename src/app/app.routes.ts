import { Routes } from '@angular/router';
import {BooksComponent} from "./books/books.component";
import {BookComponent} from "./book/book.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";

export const routes: Routes = [
  {path: 'books', component: BooksComponent},
  {path: 'book', component: BookComponent},
  {path: 'book/:id', component: BookComponent},
  {path: '', redirectTo: '/books', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];
