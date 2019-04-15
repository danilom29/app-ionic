import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KcPage } from './kc.page';

describe('KcPage', () => {
  let component: KcPage;
  let fixture: ComponentFixture<KcPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KcPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KcPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
