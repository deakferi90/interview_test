import { Component, OnInit } from '@angular/core';
import { Beneficiar } from './beneficiar.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-beneficiari',
  standalone: true,
  templateUrl: './beneficiari.component.html',
  styleUrls: ['./beneficiari.component.scss'],
  imports: [FormsModule, CommonModule, ReactiveFormsModule, MatDialogModule],
})
export class BeneficiariComponent implements OnInit {
  beneficiari: Beneficiar[] = [];
  persoane: any[] | undefined;
  newBeneficiar: Beneficiar = this.initializeNewBeneficiar();
  isEditing: boolean = false;
  isSubmitted = false;
  currentBeneficiarId: number | null = null;
  filteredBeneficiari: Beneficiar[] = [];
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  showForm = false;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadBeneficiari();
    this.persoane = [
      { id: 1, name: 'Persoană Fizică', value: 'persoana_fizica' },
      { id: 2, name: 'Persoană Juridică', value: 'persoana_juridica' },
    ];
    this.filteredBeneficiari = [...this.beneficiari];
  }

  initializeNewBeneficiar(): Beneficiar {
    return {
      tip: 'persoana_fizica',
      nume: '',
      prenume: '',
      adresa: '',
      cnp: '',
      dataInfiintarii: '',
      dataNasterii: '',
      telefon: '',
      cui: '',
      conturiIBAN: '',
    };
  }

  filterBeneficiari(event: KeyboardEvent) {
    const target = event.target as HTMLInputElement;
    const filterValue = target.value.toLowerCase();

    this.filteredBeneficiari = this.beneficiari.filter((beneficiar) => {
      const numeMatch =
        beneficiar.nume?.toLowerCase().includes(filterValue) || false;
      const prenumeMatch =
        beneficiar.prenume?.toLowerCase().includes(filterValue) || false;
      const denumire =
        beneficiar.denumire?.toLowerCase().includes(filterValue) || false;
      const tipMatch =
        beneficiar.tip?.toLowerCase().includes(filterValue) || false;
      return numeMatch || prenumeMatch || denumire || tipMatch;
    });
  }

  loadBeneficiari() {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('beneficiari');
      this.beneficiari = data ? JSON.parse(data) : [];
      this.filteredBeneficiari = [...this.beneficiari];
    }
  }

  saveBeneficiar() {
    this.isSubmitted = true;
    if (this.validateBeneficiar(this.newBeneficiar)) {
      if (this.isEditing && this.currentBeneficiarId !== null) {
        this.updateBeneficiarInList();
      } else {
        this.newBeneficiar.id = Date.now();
        this.beneficiari.push({ ...this.newBeneficiar });
      }
      localStorage.setItem('beneficiari', JSON.stringify(this.beneficiari));
      this.updateFilteredList();
      this.resetForm();
    }
  }

  updateBeneficiar(beneficiar: Beneficiar) {
    this.showForm = true;
    this.newBeneficiar = { ...beneficiar };
    this.isEditing = true;
    this.currentBeneficiarId = beneficiar.id!;
  }

  updateBeneficiarInList() {
    const index = this.beneficiari.findIndex(
      (b) => b.id === this.currentBeneficiarId
    );
    if (index !== -1) {
      this.beneficiari[index] = { ...this.newBeneficiar };
    }
    this.updateFilteredList();
    this.isEditing = false;
    this.showForm = true;
    this.currentBeneficiarId = null;
  }

  deleteConfirm(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      height: '200px',
      panelClass: 'centered-dialog',
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.beneficiari = this.beneficiari.filter((b) => b.id !== id);
        localStorage.setItem('beneficiari', JSON.stringify(this.beneficiari));
        this.updateFilteredList();
      }
    });
  }

  validateIBAN(iban: string): boolean {
    iban = iban.replace(/\s+/g, '').toUpperCase();
    if (iban.length < 15 || iban.length > 34) {
      return false;
    }
    const rearranged = iban.slice(4) + iban.slice(0, 4);
    const numericIban = rearranged.replace(/[A-Z]/g, (char) =>
      (char.charCodeAt(0) - 55).toString()
    );
    const remainder = BigInt(numericIban) % 97n;
    return remainder === 1n;
  }

  validateCUI(cui: string): boolean {
    if (!/^\d{2,10}$/.test(cui)) {
      return false;
    }
    const controlWeights = [7, 5, 3, 2, 1, 7, 5, 3, 2];
    let sum = 0;
    for (let i = 0; i < cui.length - 1; i++) {
      sum += Number(cui[i]) * controlWeights[i];
    }
    const controlDigit = sum % 11 === 10 ? 0 : sum % 11;
    return controlDigit === Number(cui[cui.length - 1]);
  }

  validateCNP(cnp: string | undefined): boolean {
    if (!cnp || cnp.length !== 13) {
      return false;
    }
    const cnpPattern = /^\d{13}$/;
    return cnpPattern.test(cnp);
  }

  validateBeneficiar(beneficiar: Beneficiar): boolean {
    const isIBANValid = this.validateIBAN(beneficiar.conturiIBAN || '');
    const isCUIValid =
      beneficiar.tip === 'persoana_juridica'
        ? this.validateCUI(beneficiar.cui || '')
        : true;
    const isCNPValid =
      beneficiar.tip === 'persoana_fizica'
        ? this.validateCNP(beneficiar.cnp || '')
        : true;

    const mandatoryFields: (keyof Beneficiar)[] =
      beneficiar.tip === 'persoana_juridica'
        ? ['cui', 'conturiIBAN']
        : ['cnp', 'conturiIBAN'];
    const areFieldsValid = mandatoryFields.every((field) => {
      const value = beneficiar[field];
      return (
        typeof value === 'string' && value.length > 0 && value.length <= 100
      );
    });

    return areFieldsValid && isIBANValid && isCUIValid && isCNPValid;
  }

  updateFilteredList() {
    this.filteredBeneficiari = [...this.beneficiari];
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

  resetForm() {
    this.newBeneficiar = this.initializeNewBeneficiar();
    this.isEditing = false;
    this.currentBeneficiarId = null;
    this.updateFilteredList();
    this.showForm = false;
    this.isSubmitted = false; // Reset submission state here
  }

  addForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm(); // Reset the form when hiding it
    } else {
      this.isSubmitted = false; // Reset submission state when showing the form
    }
  }
}
