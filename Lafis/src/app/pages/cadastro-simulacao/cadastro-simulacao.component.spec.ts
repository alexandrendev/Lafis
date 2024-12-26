import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroSimulacaoComponent } from './cadastro-simulacao.component';

describe('CadastroSimulacaoComponent', () => {
  let component: CadastroSimulacaoComponent;
  let fixture: ComponentFixture<CadastroSimulacaoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroSimulacaoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroSimulacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
