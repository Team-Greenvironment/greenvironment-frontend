import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ChatmanagerComponent} from './chatmanager.component';

describe('ChatmanagerComponent', () => {
  let component: ChatmanagerComponent;
  let fixture: ComponentFixture<ChatmanagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChatmanagerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatmanagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
