/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CommonHelperService } from './common-helper.service';

describe('Service: CommonHelper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommonHelperService]
    });
  });

  it('should ...', inject([CommonHelperService], (service: CommonHelperService) => {
    expect(service).toBeTruthy();
  }));
});
