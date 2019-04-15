import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemEfficiencyPage } from './system-efficiency.page';

describe('SystemEfficiencyPage', () => {
  let component: SystemEfficiencyPage;
  let fixture: ComponentFixture<SystemEfficiencyPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemEfficiencyPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemEfficiencyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
