export interface Beneficiar {
  id?: number;
  tip: 'persoana_fizica' | 'persoana_juridica';
  denumire?: string;
  cui?: string;
  dataInfiintarii?: string;
  adresa: string;
  telefon: string;
  conturiIBAN: string;
  nume?: string;
  prenume?: string;
  cnp?: string;
  dataNasterii?: string;
}
