import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Owner } from '../../../models/owner';

@Component({
  selector: 'app-owner-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl:'./owner-dialog.component.html',
  styleUrls: ['./owner-dialog.component.scss'],
})
export class OwnerDialogComponent {
  ownerForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { owner: Owner | null },
    private dialogRef: MatDialogRef<OwnerDialogComponent>,
    private fb: FormBuilder
  ) {
    this.ownerForm = this.fb.group({
      firstName: [data.owner?.firstName || '', Validators.required],
      lastName: [data.owner?.lastName || '', Validators.required],
      phoneNumber: [data.owner?.phoneNumber || '', Validators.required],
      email: [data.owner?.email || '', [Validators.required, Validators.email]],
      address: [data.owner?.address || '', Validators.required]
    });
  }

  onSubmit() {
    if (this.ownerForm.valid) {
      const owner = {
        ...this.ownerForm.value,
        id: this.data.owner?.id
      };
      this.dialogRef.close(owner);
    }
  }

  onCancel() {
    this.dialogRef.close(undefined);
  }
} 