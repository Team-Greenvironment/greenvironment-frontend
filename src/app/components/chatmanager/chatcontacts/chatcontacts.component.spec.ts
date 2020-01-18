import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChatcontactsComponent} from './chatcontacts.component';

describe('ChatcontactsComponent', () => {
  let component: ChatcontactsComponent;
  let fixture: ComponentFixture<ChatcontactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatcontactsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatcontactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
