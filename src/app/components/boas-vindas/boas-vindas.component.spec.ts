import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoasVindasComponent } from './boas-vindas.component';

describe('BoasVindasComponent', () => {
  let component: BoasVindasComponent;
  let fixture: ComponentFixture<BoasVindasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoasVindasComponent]
    });
    fixture = TestBed.createComponent(BoasVindasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
