import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaConsultaPlantaoComponent } from './lista-consulta-plantao.component';

describe('ListaConsultaPlantaoComponent', () => {
  let component: ListaConsultaPlantaoComponent;
  let fixture: ComponentFixture<ListaConsultaPlantaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaConsultaPlantaoComponent]
    });
    fixture = TestBed.createComponent(ListaConsultaPlantaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
