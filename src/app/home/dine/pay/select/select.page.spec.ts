import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectPage } from './select.page';

describe('SelectPage', () => {
  let component: SelectPage;
  let fixture: ComponentFixture<SelectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
