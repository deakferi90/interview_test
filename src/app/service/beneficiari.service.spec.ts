import { TestBed } from '@angular/core/testing';

import { BeneficiarService } from './beneficiari.service';

describe('BeneficiarService', () => {
  let service: BeneficiarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
