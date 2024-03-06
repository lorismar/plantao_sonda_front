import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarTurmaRecursalComponent } from './cadastrar-turma-recursal.component';

describe('CadastrarTurmaRecursalComponent', () => {
  let component: CadastrarTurmaRecursalComponent;
  let fixture: ComponentFixture<CadastrarTurmaRecursalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CadastrarTurmaRecursalComponent]
    });
    fixture = TestBed.createComponent(CadastrarTurmaRecursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
