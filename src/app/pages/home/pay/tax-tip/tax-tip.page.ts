import { Component, OnInit } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tax-tip',
  templateUrl: './tax-tip.page.html',
  styleUrls: ['./tax-tip.page.scss'],
})
export class TaxTipPage implements OnInit {

  constructor(
    public tabsService: TabsService,
    public navCtrl: NavController,
  ) { }

  public ngOnInit() {
    this.tabsService.hideTabs();
  }

  public async nextPage() {
    await this.navCtrl.navigateForward('/home/pay/status');
  }

}
