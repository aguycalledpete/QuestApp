import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivatePagesContainerComponent } from './private-pages-container.component';

describe('PrivatePagesContainerComponent', () => {
  let component: PrivatePagesContainerComponent;
  let fixture: ComponentFixture<PrivatePagesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivatePagesContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivatePagesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
