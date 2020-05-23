import { Component } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';

@Component({
  selector: 'app-explore',
  templateUrl: 'explore.page.html',
  styleUrls: ['explore.page.scss']
})
export class ExplorePage {

  constructor(
    public tabsService: TabsService,
  ) {}

  public ionViewDidEnter() {
    this.tabsService.showTabs();
  }
}
