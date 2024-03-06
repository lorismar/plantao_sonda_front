import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAreaRegiaoComponent } from './lista-area-regiao.component';

describe('ListaAreaRegiaoComponent', () => {
  let component: ListaAreaRegiaoComponent;
  let fixture: ComponentFixture<ListaAreaRegiaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListaAreaRegiaoComponent]
    });
    fixture = TestBed.createComponent(ListaAreaRegiaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
