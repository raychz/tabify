import { Component } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';

@Component({
  selector: 'app-socialize',
  templateUrl: 'socialize.page.html',
  styleUrls: ['socialize.page.scss']
})
export class SocializePage {

  constructor(
    public tabsService: TabsService,
  ) {}

  public ionViewDidEnter() {
    this.tabsService.showTabs();
  }
}
