import { TestBed } from '@angular/core/testing';

import { LbBcCleanArchService } from './lb-bc-clean-arch.service';

describe('LbBcCleanArchService', () => {
  let service: LbBcCleanArchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LbBcCleanArchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
