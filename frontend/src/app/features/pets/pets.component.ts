import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { PetService } from '../../services/pet.service';
import { PetDialogComponent } from './pet-dialog/pet-dialog.component';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatChipsModule
  ],
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.scss'], 
})
export class PetsComponent implements OnInit {
  pets: any[] = [];
  filteredPets: any[] = [];
  isVet: boolean = false;

  constructor(
    private petService: PetService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.isVet = this.authService.isVet();
  }

  ngOnInit() {
    this.loadPets();
  }

  loadPets() {
    this.petService.getAllPets().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.filteredPets = pets;
      },
      error: (error) => {
        console.error('Error loading pets:', error);
        this.showError('Failed to load pets');
      }
    });
  }

  filterPets(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredPets = this.pets.filter(pet => 
      pet.name.toLowerCase().includes(searchTerm) ||
      pet.species.toLowerCase().includes(searchTerm) ||
      pet.breed.toLowerCase().includes(searchTerm) ||
      (this.isVet && pet.owner && 
        (`${pet.owner.firstName} ${pet.owner.lastName}`).toLowerCase().includes(searchTerm))
    );
  }

  openPetDialog(pet?: any) {
    const dialogRef = this.dialog.open(PetDialogComponent, {
      width: '500px',
      data: { pet: pet, isVet: this.isVet }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      // Only proceed if result exists and is not undefined/null
      if (result) {
        if (result.id) {
          // Update existing pet
          this.petService.updatePet(result.id, result).subscribe({
            next: () => {
              this.loadPets();
              this.showSuccess('Pet updated successfully');
            },
            error: (error) => {
              console.error('Error updating pet:', error);
              this.showError('Failed to update pet');
            }
          });
        } else if (!result.id && Object.keys(result).length > 0) {
          // Create new pet
          this.petService.createPet(result).subscribe({
            next: () => {
              this.loadPets();
              this.showSuccess('Pet added successfully');
            },
            error: (error) => {
              console.error('Error creating pet:', error);
              this.showError('Failed to create pet');
            }
          });
        }
      }
    });
  }
  
  deletePet(id: number) {
    if (confirm('Are you sure you want to delete this pet?')) {
      this.petService.deletePet(id).subscribe({
        next: () => {
          this.loadPets();
          this.showSuccess('Pet deleted successfully');
        },
        error: (error) => {
          console.error('Error deleting pet:', error);
          this.showError('Failed to delete pet');
        }
      });
    }
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