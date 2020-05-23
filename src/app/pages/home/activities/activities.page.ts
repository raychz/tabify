import { Component } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';

@Component({
  selector: 'app-activities',
  templateUrl: 'activities.page.html',
  styleUrls: ['activities.page.scss']
})
export class ActivitiesPage {

  constructor(
    public tabsService: TabsService,
  ) {}

  public ionViewDidEnter() {
    this.tabsService.showTabs();
  }
}
