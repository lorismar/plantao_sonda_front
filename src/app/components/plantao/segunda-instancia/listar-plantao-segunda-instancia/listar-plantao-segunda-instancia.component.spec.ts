import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlantaoSegundaInstanciaComponent } from './listar-plantao-segunda-instancia.component';

describe('ListarPlantaoSegundaInstanciaComponent', () => {
  let component: ListarPlantaoSegundaInstanciaComponent;
  let fixture: ComponentFixture<ListarPlantaoSegundaInstanciaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarPlantaoSegundaInstanciaComponent]
    });
    fixture = TestBed.createComponent(ListarPlantaoSegundaInstanciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
