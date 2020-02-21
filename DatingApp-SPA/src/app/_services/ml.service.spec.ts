/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MlService } from './ml.service';

describe('Service: Ml', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MlService]
    });
  });

  it('should ...', inject([MlService], (service: MlService) => {
    expect(service).toBeTruthy();
  }));
});
