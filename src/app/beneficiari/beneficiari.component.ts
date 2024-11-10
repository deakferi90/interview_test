import { Component, OnInit } from '@angular/core';
import { Beneficiar } from './beneficiar.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BeneficiarService } from '../service/beneficiari.service';
import { ToastrService } from 'ngx-toastr';
import { BeneficiarTableComponent } from './beneficiar-table/beneficiar-table.component';
import { BeneficiarFormComponent } from './beneficiar-form/beneficiar-form.component';
import { Persoana } from './persoana.interface';

@Component({
  selector: 'app-beneficiari',
  standalone: true,
  templateUrl: './beneficiari.component.html',
  styleUrls: ['./beneficiari.component.scss'],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    BeneficiarTableComponent,
    BeneficiarFormComponent,
  ],
})
export class BeneficiariComponent implements OnInit {
  beneficiari: Beneficiar[] = [];
  persoane: Persoana[] | undefined;
  newBeneficiar: Beneficiar = this.initializeNewBeneficiar();
  isEditing: boolean = false;
  isSubmitted = false;
  currentBeneficiarId: number | null = null;
  filteredBeneficiari: Beneficiar[] = [];
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  showForm = false;

  constructor(
    public dialog: MatDialog,
    private beneficiarService: BeneficiarService
  ) {}

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
    this.beneficiari = this.beneficiarService.loadBeneficiari();
    this.filteredBeneficiari = [...this.beneficiari];
  }

  updateFilteredList() {
    this.filteredBeneficiari = [...this.beneficiari];
  }

  updateBeneficiar(beneficiar: Beneficiar) {
    this.showForm = true;
    this.newBeneficiar = { ...beneficiar };
    this.isEditing = true;
    this.currentBeneficiarId = beneficiar.id!;
  }

  resetForm() {
    this.newBeneficiar = this.initializeNewBeneficiar();
    this.isEditing = false;
    this.currentBeneficiarId = null;
    this.updateFilteredList();
    this.showForm = false;
    this.isSubmitted = false;
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
