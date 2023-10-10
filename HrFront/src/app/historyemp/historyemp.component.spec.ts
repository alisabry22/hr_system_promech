import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryempComponent } from './historyemp.component';

describe('HistoryempComponent', () => {
  let component: HistoryempComponent;
  let fixture: ComponentFixture<HistoryempComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryempComponent]
    });
    fixture = TestBed.createComponent(HistoryempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
