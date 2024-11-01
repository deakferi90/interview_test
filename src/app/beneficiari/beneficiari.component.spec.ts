import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiariComponent } from './beneficiari.component';

describe('BeneficiariComponent', () => {
  let component: BeneficiariComponent;
  let fixture: ComponentFixture<BeneficiariComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeneficiariComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiariComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
