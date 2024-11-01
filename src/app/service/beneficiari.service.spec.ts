import { TestBed } from '@angular/core/testing';

import { BeneficiariService } from './beneficiari.service';

describe('BeneficiariService', () => {
  let service: BeneficiariService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiariService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
