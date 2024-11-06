import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiarTableComponent } from './beneficiar-table.component';

describe('BeneficiarTableComponent', () => {
  let component: BeneficiarTableComponent;
  let fixture: ComponentFixture<BeneficiarTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiarTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiarTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
