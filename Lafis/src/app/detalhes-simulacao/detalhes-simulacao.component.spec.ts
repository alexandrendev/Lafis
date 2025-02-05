import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesSimulacaoComponent } from './detalhes-simulacao.component';

describe('DetalhesSimulacaoComponent', () => {
  let component: DetalhesSimulacaoComponent;
  let fixture: ComponentFixture<DetalhesSimulacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesSimulacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesSimulacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
