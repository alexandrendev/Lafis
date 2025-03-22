import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationReportComponent } from './simulation-report.component';

describe('SimulationReportComponent', () => {
  let component: SimulationReportComponent;
  let fixture: ComponentFixture<SimulationReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationReportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimulationReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
