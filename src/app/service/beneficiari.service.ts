import { Injectable } from '@angular/core';
import { Beneficiar } from '../beneficiari/beneficiar.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class BeneficiarService {
  private storageKey = 'beneficiari';

  constructor() {}

  loadBeneficiari(): Beneficiar[] {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  saveBeneficiari(beneficiari: Beneficiar[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(beneficiari));
  }

  addBeneficiar(beneficiar: Beneficiar): void {
    const beneficiari = this.loadBeneficiari();
    beneficiari.push(beneficiar);
    this.saveBeneficiari(beneficiari);
  }

  updateBeneficiar(updatedBeneficiar: Beneficiar): void {
    const beneficiari = this.loadBeneficiari();
    const index = beneficiari.findIndex((b) => b.id === updatedBeneficiar.id);
    if (index !== -1) {
      beneficiari[index] = updatedBeneficiar;
      this.saveBeneficiari(beneficiari);
    }
  }

  deleteBeneficiar(id: number): void {
    const beneficiari = this.loadBeneficiari();
    const updatedBeneficiari = beneficiari.filter((b) => b.id !== id);
    this.saveBeneficiari(updatedBeneficiari);
  }
}
