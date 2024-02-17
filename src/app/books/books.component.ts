import { Component } from '@angular/core';
import {Book} from "../book/book";
import {
  conflictsAndAdaptations,
  landscapesOfIdentity, oneHundredFiftyHouses,
  oneHundredStepsThrough20thCenturyEstonianArchitecture
} from "../book/book-data-common";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'books',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent {
  books: Book[] = [
    landscapesOfIdentity(),
    conflictsAndAdaptations(),
    oneHundredStepsThrough20thCenturyEstonianArchitecture(),
    oneHundredFiftyHouses()
  ];
}
