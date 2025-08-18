import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { IconType } from '@/shared/constants/icon.constant';

@Component({
  selector: 'app-card',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {
  titleInput = input.required<string>();
  subtitleInput = input.required<string>();
  iconInput = input.required<IconType>();
}
