import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputPlantaoComponent } from './input-plantao.component';

describe('InputPlantaoComponent', () => {
  let component: InputPlantaoComponent;
  let fixture: ComponentFixture<InputPlantaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputPlantaoComponent]
    });
    fixture = TestBed.createComponent(InputPlantaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
