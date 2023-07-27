import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpliexcelComponent } from './spliexcel.component';

describe('SpliexcelComponent', () => {
  let component: SpliexcelComponent;
  let fixture: ComponentFixture<SpliexcelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpliexcelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpliexcelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
