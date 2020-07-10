import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreejsEditorComponent } from './threejs-editor.component';

describe('ThreejsEditorComponent', () => {
  let component: ThreejsEditorComponent;
  let fixture: ComponentFixture<ThreejsEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThreejsEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreejsEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
