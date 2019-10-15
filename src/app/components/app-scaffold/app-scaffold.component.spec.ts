import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppScaffoldComponent } from './app-scaffold.component';

describe('AppScaffoldComponent', () => {
  let component: AppScaffoldComponent;
  let fixture: ComponentFixture<AppScaffoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppScaffoldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppScaffoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
