import { Component, signal, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-{{name}}',
  templateUrl: './{{name}}.html',
  styleUrls: ['./{{name}}.scss'],
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule],
})
export class {{pascalName}} {
  readonly filter = signal('');
  valueChange = output<string>();

  onInput(value: string) {
    this.filter.set(value);
    this.valueChange.emit(value.trim().toLowerCase());
  }
}
