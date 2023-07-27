import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttperrorComponent } from './httperror.component';

describe('HttperrorComponent', () => {
  let component: HttperrorComponent;
  let fixture: ComponentFixture<HttperrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HttperrorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HttperrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
