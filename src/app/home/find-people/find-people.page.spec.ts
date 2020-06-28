import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FindPeoplePage } from './find-people.page';

describe('FindPeoplePage', () => {
  let component: FindPeoplePage;
  let fixture: ComponentFixture<FindPeoplePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindPeoplePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FindPeoplePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
