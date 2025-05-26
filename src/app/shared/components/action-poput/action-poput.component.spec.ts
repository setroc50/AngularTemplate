import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPoputComponent } from './action-poput.component';

describe('ActionPoputComponent', () => {
  let component: ActionPoputComponent;
  let fixture: ComponentFixture<ActionPoputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionPoputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionPoputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
