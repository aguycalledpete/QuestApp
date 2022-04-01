import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPagesContainerComponent } from './public-pages-container.component';

describe('PublicPagesContainerComponent', () => {
  let component: PublicPagesContainerComponent;
  let fixture: ComponentFixture<PublicPagesContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicPagesContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicPagesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
