import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacaoDetailModalComponent } from './simulacao-detail-modal.component';

describe('SimulacaoDetailModalComponent', () => {
  let component: SimulacaoDetailModalComponent;
  let fixture: ComponentFixture<SimulacaoDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulacaoDetailModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulacaoDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
