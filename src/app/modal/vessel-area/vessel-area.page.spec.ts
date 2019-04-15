import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselAreaPage } from './vessel-area.page';

describe('VesselAreaPage', () => {
  let component: VesselAreaPage;
  let fixture: ComponentFixture<VesselAreaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VesselAreaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselAreaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
