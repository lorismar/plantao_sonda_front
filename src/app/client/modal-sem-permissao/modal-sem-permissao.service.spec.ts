import { TestBed } from '@angular/core/testing';

import { ModalSemPermissaoService } from './modal-sem-permissao.service';

describe('ModalSemPermissaoService', () => {
  let service: ModalSemPermissaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalSemPermissaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
