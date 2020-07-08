import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SocializePage } from './socialize.page';

describe('SocializePage', () => {
  let component: SocializePage;
  let fixture: ComponentFixture<SocializePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SocializePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SocializePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
