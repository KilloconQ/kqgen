import { Component, input } from "@angular/core";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";

import { IconType } from "@/shared/constants/icon.constant";

@Component({
  selector: "app-card",
  imports: [MatCardModule, MatIconModule],
  templateUrl: "./card.component.html",
  styleUrl: "./card.component.scss",
})
export class CardComponent {
  titleInput = input.required<string>();
  subtitleInput = input.required<string>();
  iconInput = input.required<IconType>();
}
