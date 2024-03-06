import { TestBed } from '@angular/core/testing';

import { ConsultaPublicaPlantaoService } from './consulta-publica-plantao.service';

describe('ConsultaPublicaPlantaoService', () => {
  let service: ConsultaPublicaPlantaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultaPublicaPlantaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
