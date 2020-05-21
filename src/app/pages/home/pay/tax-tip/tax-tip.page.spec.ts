import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TaxTipPage } from './tax-tip.page';

describe('TaxTipPage', () => {
  let component: TaxTipPage;
  let fixture: ComponentFixture<TaxTipPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxTipPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TaxTipPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
