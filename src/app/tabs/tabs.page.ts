import { Component } from '@angular/core';

export enum Tabs {
  PAY = 'PAY',
  ACTIVITIES = 'ACTIVITIES',
  EXPLORE = 'EXPLORE'
}

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})

export class TabsPage {
  curTab = Tabs.PAY;
  // expose enum to template
  tabs = Tabs;

  constructor() {}


  changeTab(tab) {
    // this.curTab = tab;
    console.log(tab);
  }

}
