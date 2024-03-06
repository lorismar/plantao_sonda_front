import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarPlantaoComponent } from './cadastrar-plantao.component';

describe('CadastrarPlantaoComponent', () => {
  let component: CadastrarPlantaoComponent;
  let fixture: ComponentFixture<CadastrarPlantaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastrarPlantaoComponent]
    });
    fixture = TestBed.createComponent(CadastrarPlantaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
