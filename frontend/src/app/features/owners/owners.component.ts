import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { OwnerService } from '../../services/owner.service';
import { Owner } from '../../models/owner';
import { OwnerDialogComponent } from './owner-dialog/owner-dialog.component';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-owners',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.scss'], 
})
export class OwnersComponent implements OnInit {
  owners: Owner[] = [];
  filteredOwners: Owner[] = [];
  isVet: boolean = false;

  constructor(
    private ownerService: OwnerService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.isVet = this.authService.isVet();
  }

  ngOnInit() {
    this.loadOwners();
  }

  loadOwners() {
    if (this.isVet) {
      this.ownerService.getAllOwners().subscribe({
        next: (owners) => {
          this.owners = owners;
          this.filteredOwners = owners;
        },
        error: (error) => {
          console.error('Error loading owners:', error);
          this.showError('Failed to load owners');
        }
      });
    } else {
      this.ownerService.getCurrentOwner().subscribe({
        next: (owner) => {
          this.owners = [owner];
          this.filteredOwners = [owner];
        },
        error: (error) => {
          console.error('Error loading owner details:', error);
          this.showError('Failed to load owner details');
        }
      });
    }
  }

  filterOwners(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredOwners = this.owners.filter(owner => 
      owner.firstName.toLowerCase().includes(searchTerm) ||
      owner.lastName.toLowerCase().includes(searchTerm) ||
      owner.email.toLowerCase().includes(searchTerm)
    );
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  openOwnerDialog(owner?: Owner) {
    const dialogRef = this.dialog.open(OwnerDialogComponent, {
      width: '500px',
      data: { owner: owner || null }
    });

    dialogRef.afterClosed().subscribe(result => {
      // Only proceed if we have actual form data
      if (result && Object.keys(result).length > 0) {
        if (result.id) {
          // Update existing owner
          this.ownerService.updateOwner(result.id, result).subscribe({
            next: () => {
              this.loadOwners();
              this.showSuccess('Owner updated successfully');
            },
            error: (error) => {
              console.error('Error updating owner:', error);
              this.showError('Failed to update owner');
            }
          });
        } else {
          // Create new owner
          this.ownerService.createOwner(result).subscribe({
            next: () => {
              this.loadOwners();
              this.showSuccess('Owner created successfully');
            },
            error: (error) => {
              console.error('Error creating owner:', error);
              this.showError('Failed to create owner');
            }
          });
        }
      }
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

  deleteOwner(id: number) {
    if (confirm('Are you sure you want to delete this owner?')) {
      this.ownerService.deleteOwner(id).subscribe({
        next: () => {
          this.loadOwners();
        },
        error: (error) => console.error('Error deleting owner:', error)
      });
    }
  }
} 