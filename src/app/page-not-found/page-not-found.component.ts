import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-not-found',
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PageNotFoundComponent {}
