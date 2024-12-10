import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { VetService } from '../../../models/vet-service';

@Component({
  selector: 'app-service-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    MatIconModule
  ],
  templateUrl: './service-dialog.component.html',
  styleUrls: ['./service-dialog.component.scss'],
})
export class ServiceDialogComponent implements OnInit {
  serviceForm: FormGroup;

  availableIcons = [
    'pets', 'healing', 'vaccines', 'medication', 'medical_services',
    'health_and_safety', 'monitor_heart', 'psychology', 'science',
    'sanitizer', 'cleaning_services', 'cut', 'water_drop', 'scale',
    'bloodtype', 'medication_liquid', 'view_timeline', 'calendar_month'
  ];

  availableColors = [
    '#4caf50', '#2196f3', '#9c27b0', '#ff5722', '#607d8b',
    '#ff9800', '#795548', '#009688', '#673ab7', '#3f51b5',
    '#e91e63', '#f44336', '#00bcd4', '#8bc34a', '#ffeb3b'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VetService | null
  ) {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      duration: ['', [Validators.required, Validators.min(1)]],
      price: ['', [Validators.required, Validators.min(0)]],
      icon: ['pets', Validators.required],
      iconBg: ['#4caf50', Validators.required]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.serviceForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.serviceForm.valid) {
      const service = {
        ...this.serviceForm.value,
        id: this.data?.id
      };
      this.dialogRef.close(service);
    }
  }

  selectIcon(icon: string) {
    this.serviceForm.patchValue({ icon });
  }

  selectColor(color: string) {
    this.serviceForm.patchValue({ iconBg: color });
  }
} 