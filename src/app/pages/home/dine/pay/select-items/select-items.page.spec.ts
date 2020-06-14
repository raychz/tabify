import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectItemsPage } from './select-items.page';

describe('SelectItemsPage', () => {
  let component: SelectItemsPage;
  let fixture: ComponentFixture<SelectItemsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectItemsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
