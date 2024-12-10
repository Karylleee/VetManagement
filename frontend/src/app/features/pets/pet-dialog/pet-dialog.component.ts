import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { OwnerService } from '../../../services/owner.service';
import { PetService } from '../../../services/pet.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pet-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './pet-dialog.component.html',
  styleUrls: ['./pet-dialog.component.scss'],
})
export class PetDialogComponent implements OnInit {
  petForm: FormGroup;
  owners: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { pet: any; isVet: boolean },
    private petService: PetService,
    private ownerService: OwnerService,
    private snackBar: MatSnackBar
  ) {
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      ownerId: [null]
    });

    if (data.isVet) {
      this.petForm.get('ownerId')?.setValidators(Validators.required);
    }
  }

  ngOnInit() {
    if (this.data.pet) {
      this.petForm.patchValue({
        name: this.data.pet.name,
        species: this.data.pet.species,
        breed: this.data.pet.breed,
        age: this.data.pet.age,
        ownerId: this.data.pet.owner?.id
      });
    }

    if (this.data.isVet) {
      this.loadOwners();
    }
  }

  loadOwners() {
    this.ownerService.getAllOwners().subscribe({
      next: (owners) => {
        this.owners = owners;
      },
      error: (error) => {
        console.error('Error loading owners:', error);
        this.showError('Failed to load owners');
      }
    });
  }

  onSubmit() {
    if (this.petForm.valid) {
      const formData = this.petForm.value;
      if (this.data.pet) {
        formData.id = this.data.pet.id;
      }
      
      if (formData.ownerId) {
        formData.owner = { id: formData.ownerId };
        delete formData.ownerId;
      }
      
      this.dialogRef.close(formData);
    }
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }
} 