import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditempComponent } from './editemp.component';

describe('EditempComponent', () => {
  let component: EditempComponent;
  let fixture: ComponentFixture<EditempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditempComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
