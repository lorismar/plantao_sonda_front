import { TestBed } from '@angular/core/testing';

import { TurmaRecursalService } from './turma-recursal.service';

describe('TurmaRecursalService', () => {
  let service: TurmaRecursalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TurmaRecursalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
