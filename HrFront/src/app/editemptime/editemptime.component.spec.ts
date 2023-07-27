import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditemptimeComponent } from './editemptime.component';

describe('EditemptimeComponent', () => {
  let component: EditemptimeComponent;
  let fixture: ComponentFixture<EditemptimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditemptimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditemptimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
