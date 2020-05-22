import { Component, OnInit } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-status',
  templateUrl: './status.page.html',
  styleUrls: ['./status.page.scss'],
})
export class StatusPage implements OnInit {

  constructor(
    public tabsService: TabsService,
    public navCtrl: NavController,
  ) { }

  public ngOnInit() {
    this.tabsService.hideTabs();
  }

  public async nextPage() {
    this.navCtrl.navigateRoot('/home/pay');
  }

}
