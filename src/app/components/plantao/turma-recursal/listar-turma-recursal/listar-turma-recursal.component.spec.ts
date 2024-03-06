import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarTurmaRecursalComponent } from './listar-turma-recursal.component';

describe('ListarTurmaRecursalComponent', () => {
  let component: ListarTurmaRecursalComponent;
  let fixture: ComponentFixture<ListarTurmaRecursalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarTurmaRecursalComponent]
    });
    fixture = TestBed.createComponent(ListarTurmaRecursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
