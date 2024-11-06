import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Beneficiar } from '../beneficiar.model';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BeneficiarService } from '../../service/beneficiari.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-beneficiar-table',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './beneficiar-table.component.html',
  styleUrl: './beneficiar-table.component.css',
})
export class BeneficiarTableComponent implements OnInit {
  @Input() beneficiari: Beneficiar[] = [];
  @Input() filteredBeneficiari: Beneficiar[] = [];
  @Input() sortColumn: string | null = null;
  @Input() sortDirection: 'asc' | 'desc' = 'asc';
  @Input() newBeneficiar!: Beneficiar;
  @Input() initializeNewBeneficiar!: () => Beneficiar;
  @Input() isEditing!: boolean;
  @Input() currentBeneficiarId!: number | null;
  @Input() showForm!: boolean;
  @Input() isSubmitted!: boolean;

  constructor(
    public dialog: MatDialog,
    private beneficiarService: BeneficiarService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadBeneficiari();
  }

  sortTable(column: keyof Beneficiar) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortDirection = 'asc';
    }
    this.sortColumn = column;

    this.filteredBeneficiari.sort((a, b) => {
      const valueA = a[column] || '';
      const valueB = b[column] || '';

      const comparison = valueA
        .toString()
        .localeCompare(valueB.toString(), undefined, {
          numeric: true,
        });

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  deleteConfirm(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: '200px',
      panelClass: 'centered-dialog',
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.beneficiarService.deleteBeneficiar(id);
        this.loadBeneficiari();
        this.resetForm();
        this.toastr.success('Beneficiar șters cu succes!');
      }
    });
  }

  updateBeneficiar(beneficiar: Beneficiar) {
    this.showForm = true;
    this.isEditing = true;
    this.newBeneficiar = { ...beneficiar };
    this.currentBeneficiarId = beneficiar.id!;
  }

  resetForm() {
    this.newBeneficiar = this.initializeNewBeneficiar();
    this.isEditing = false;
    this.currentBeneficiarId = null;
    this.filteredBeneficiari = [...this.beneficiari];
    this.showForm = false;
    this.isSubmitted = false;
  }

  loadBeneficiari() {
    this.beneficiari = this.beneficiarService.loadBeneficiari();
    this.filteredBeneficiari = [...this.beneficiari];
  }

  updateBeneficiarInList() {
    if (this.currentBeneficiarId !== null) {
      this.beneficiarService.updateBeneficiar({
        ...this.newBeneficiar,
        id: this.currentBeneficiarId,
      });
      this.loadBeneficiari();
    }
  }

  addForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    } else {
      this.isSubmitted = false;
    }
  }
}
