import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarPlantaoSegundaInstanciaComponent } from './cadastrar-plantao-segunda-instancia.component';

describe('CadastrarPlantaoSegundaInstanciaComponent', () => {
  let component: CadastrarPlantaoSegundaInstanciaComponent;
  let fixture: ComponentFixture<CadastrarPlantaoSegundaInstanciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastrarPlantaoSegundaInstanciaComponent]
    });
    fixture = TestBed.createComponent(CadastrarPlantaoSegundaInstanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
