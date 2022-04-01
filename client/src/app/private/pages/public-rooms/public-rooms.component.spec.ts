import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicRoomsComponent } from './public-rooms.component';

describe('PublicRoomsComponent', () => {
  let component: PublicRoomsComponent;
  let fixture: ComponentFixture<PublicRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicRoomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
