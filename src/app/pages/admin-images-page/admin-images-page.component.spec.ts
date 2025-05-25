import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminImagesPageComponent } from './admin-images-page.component';

describe('AdminImagesPageComponent', () => {
  let component: AdminImagesPageComponent;
  let fixture: ComponentFixture<AdminImagesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminImagesPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminImagesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
