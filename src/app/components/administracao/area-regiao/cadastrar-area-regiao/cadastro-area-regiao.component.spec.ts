import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroAreaRegiaoComponent } from './cadastro-area-regiao.component';

describe('CadastroAreaRegiaoComponent', () => {
  let component: CadastroAreaRegiaoComponent;
  let fixture: ComponentFixture<CadastroAreaRegiaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastroAreaRegiaoComponent]
    });
    fixture = TestBed.createComponent(CadastroAreaRegiaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
