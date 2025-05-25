import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLandinPageComponent } from './admin-landin-page.component';

describe('AdminLandinPageComponent', () => {
  let component: AdminLandinPageComponent;
  let fixture: ComponentFixture<AdminLandinPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminLandinPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLandinPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
