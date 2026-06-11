import { TestBed } from '@angular/core/testing';

import { NavState } from './nav-state';

describe('NavState', () => {
  let service: NavState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
