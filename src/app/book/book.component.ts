import { Component, OnInit, inject } from '@angular/core';
import {Book} from "../models/book";
import {BookService} from "../book.service";
import {ActivatedRoute} from "@angular/router";
import { Location } from "@angular/common";

@Component({
  selector: 'book',
  imports: [],
  templateUrl: './book.component.html',
  standalone: true,
  styleUrl: './book.component.css'
})
export class BookComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);
  private location = inject(Location);

  book!: Book;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
  }

  ngOnInit(): void {
    this.getBook();
  }

  getBook(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBook(id)
      .subscribe(book => this.book = book);
  }

  goBack(): void {
    this.location.back();
  }
}
