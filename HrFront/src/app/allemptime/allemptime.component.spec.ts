import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllemptimeComponent } from './allemptime.component';

describe('AllemptimeComponent', () => {
  let component: AllemptimeComponent;
  let fixture: ComponentFixture<AllemptimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllemptimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllemptimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
