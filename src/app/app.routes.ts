import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BeneficiariComponent } from './beneficiari/beneficiari.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'beneficiar',
    component: BeneficiariComponent,
  },
];
