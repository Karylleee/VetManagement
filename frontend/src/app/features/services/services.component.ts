import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { VetServiceService } from '../../services/vet-service.service';
import { VetService } from '../../models/vet-service';
import { MatDialog } from '@angular/material/dialog';
import { ServiceDialogComponent } from './service-dialog/service-dialog.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule
  ],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  services: VetService[] = [];

  constructor(
    private vetServiceService: VetServiceService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadServices();
  }

  loadServices() {
    this.vetServiceService.getAllServices().subscribe({
      next: (services) => {
        this.services = services;
      },
      error: (error) => console.error('Error loading services:', error)
    });
  }

  formatDuration(minutes: number): string {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
    return `${minutes} mins`;
  }

  formatPrice(price: number): string {
    return `₱${price.toFixed(2)}`;
  }

  openServiceDialog(service?: VetService) {
    const dialogRef = this.dialog.open(ServiceDialogComponent, {
      data: service || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.vetServiceService.updateService(result.id, result).subscribe({
            next: () => this.loadServices(),
            error: (error) => console.error('Error updating service:', error)
          });
        } else {
          this.vetServiceService.createService(result).subscribe({
            next: () => this.loadServices(),
            error: (error) => console.error('Error creating service:', error)
          });
        }
      }
    });
  }

  deleteService(id: number | undefined) {
    if (id === undefined) return;
    
    if (confirm('Are you sure you want to delete this service?')) {
      this.vetServiceService.deleteService(id).subscribe({
        next: () => this.loadServices(),
        error: (error) => console.error('Error deleting service:', error) 
      });
    }
  }
} 