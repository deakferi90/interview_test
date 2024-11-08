import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Beneficiar } from '../beneficiar.model';
import { ToastrService } from 'ngx-toastr';
import { BeneficiarService } from '../../service/beneficiari.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Persoana } from '../persoana.interface';

@Component({
  selector: 'app-beneficiar-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './beneficiar-form.component.html',
  styleUrl: './beneficiar-form.component.css',
})
export class BeneficiarFormComponent {
  @Input() beneficiari: Beneficiar[] = [];
  @Input() filteredBeneficiari: Beneficiar[] = [];
  @Input() showForm: boolean = false;
  @Input() currentBeneficiarId!: number | null;
  @Input() isSubmitted!: boolean;
  @Input() isEditing: boolean = true;
  @Input() persoane!: Persoana[] | undefined;
  @Input() newBeneficiar!: Beneficiar;
  constructor(
    private toastr: ToastrService,
    private beneficiarService: BeneficiarService
  ) {}

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

  saveBeneficiar() {
    this.isSubmitted = true;
    if (this.validateBeneficiar(this.newBeneficiar)) {
      if (this.isEditing && this.currentBeneficiarId !== null) {
        this.updateBeneficiarInList();
        this.toastr.success('Beneficiar actualizat cu succes!');
      } else {
        this.newBeneficiar.id = Date.now();
        this.beneficiarService.addBeneficiar({ ...this.newBeneficiar });
        this.toastr.success('Beneficiar adăugat cu succes!');
      }
      this.loadBeneficiari();
      this.resetForm();
    }
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

  resetForm() {
    this.newBeneficiar = this.initializeNewBeneficiar();
    this.isEditing = false;
    this.currentBeneficiarId = null;
    this.filteredBeneficiari = [...this.beneficiari];
    this.showForm = !this.showForm;
    this.isSubmitted = false;
  }

  loadBeneficiari() {
    this.beneficiari = this.beneficiarService.loadBeneficiari();
    this.filteredBeneficiari = [...this.beneficiari];
  }
}
