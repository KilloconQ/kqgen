import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-{{name}}',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, MatDialogRef, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './add.html',
  styleUrls: ['./add.scss']
})
export class Add{{pascalName}}Component {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<Add{{pascalName}}Component>);

  public {{name}}Form!: FormGroup;

  constructor() {
    this.initForm();
  }

  public send() {
    console.log('Enviar', this.{{name}}Form.value);
  }

  private initForm() {
    this.{{name}}Form = this.fb.group({
      control1: ['', Validators.required],
      control2: ['', Validators.required]
    });
  }

}
