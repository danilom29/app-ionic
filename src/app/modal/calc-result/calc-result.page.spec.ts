import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalcResultPage } from './calc-result.page';

describe('CalcResultPage', () => {
  let component: CalcResultPage;
  let fixture: ComponentFixture<CalcResultPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalcResultPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalcResultPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
