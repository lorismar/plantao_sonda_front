import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioConsultaComponent } from './inicio-consulta.component';

describe('InicioConsultaComponent', () => {
  let component: InicioConsultaComponent;
  let fixture: ComponentFixture<InicioConsultaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InicioConsultaComponent]
    });
    fixture = TestBed.createComponent(InicioConsultaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
