import { Component, OnInit } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-select-items',
  templateUrl: './select-items.page.html',
  styleUrls: ['./select-items.page.scss'],
})
export class SelectItemsPage {

  constructor(
    public tabsService: TabsService,
    public navCtrl: NavController,
  ) { }

  public ionViewDidEnter() {
    this.tabsService.hideTabs();
  }

  public async nextPage() {
    await this.navCtrl.navigateForward('/home/dine/pay/tax-tip');
  }

}
