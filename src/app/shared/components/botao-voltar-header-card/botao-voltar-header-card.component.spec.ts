import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoVoltarHeaderCardComponent } from './botao-voltar-header-card.component';

describe('BotaoVoltarHeaderCardComponent', () => {
  let component: BotaoVoltarHeaderCardComponent;
  let fixture: ComponentFixture<BotaoVoltarHeaderCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BotaoVoltarHeaderCardComponent]
    });
    fixture = TestBed.createComponent(BotaoVoltarHeaderCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
