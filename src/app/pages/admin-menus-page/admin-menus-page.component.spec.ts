import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMenusPageComponent } from './admin-menus-page.component';

describe('AdminMenusPageComponent', () => {
  let component: AdminMenusPageComponent;
  let fixture: ComponentFixture<AdminMenusPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminMenusPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminMenusPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
