import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPlantaoComponent } from './listar-plantao.component';

describe('ListarPlantaoComponent', () => {
  let component: ListarPlantaoComponent;
  let fixture: ComponentFixture<ListarPlantaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarPlantaoComponent]
    });
    fixture = TestBed.createComponent(ListarPlantaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
