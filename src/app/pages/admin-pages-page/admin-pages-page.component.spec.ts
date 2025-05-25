import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPagesPageComponent } from './admin-pages-page.component';

describe('AdminPagesPageComponent', () => {
  let component: AdminPagesPageComponent;
  let fixture: ComponentFixture<AdminPagesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPagesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPagesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
