import { TestBed } from '@angular/core/testing';

import { HomebrewService } from './homebrew.service';

describe('HomebrewService', () => {
  let service: HomebrewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomebrewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
