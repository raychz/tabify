import { Component } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-explore',
  templateUrl: 'explore.page.html',
  styleUrls: ['explore.page.scss']
})
export class ExplorePage {

  constructor(
    public navCtrl: NavController
  ) {}

  public ionViewDidEnter() {
  }

  viewLocationDetails() {
    this.navCtrl.navigateForward('home/explore/someLocationSlug');
  }
}
