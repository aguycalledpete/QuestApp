import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityCheckComponent } from './security-check.component';

describe('SecurityCheckComponent', () => {
  let component: SecurityCheckComponent;
  let fixture: ComponentFixture<SecurityCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecurityCheckComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
