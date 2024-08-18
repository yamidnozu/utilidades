import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LbBcCleanArchComponent } from './lb-bc-clean-arch.component';

describe('LbBcCleanArchComponent', () => {
  let component: LbBcCleanArchComponent;
  let fixture: ComponentFixture<LbBcCleanArchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LbBcCleanArchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LbBcCleanArchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
