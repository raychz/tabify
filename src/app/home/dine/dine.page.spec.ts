import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DinePage } from './dine.page';

describe('DinePage', () => {
  let component: DinePage;
  let fixture: ComponentFixture<DinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DinePage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
