import { Component, OnInit } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage {

  constructor(
    public tabsService: TabsService,
    public navCtrl: NavController,
  ) { }

  public ionViewDidEnter() {
    this.tabsService.hideTabs();
  }

  public async nextPage() {
    this.navCtrl.navigateRoot('home');
  }

}
