import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPermitionsPageComponent } from './admin-permitions-page.component';

describe('AdminPermitionsPageComponent', () => {
  let component: AdminPermitionsPageComponent;
  let fixture: ComponentFixture<AdminPermitionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPermitionsPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPermitionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
