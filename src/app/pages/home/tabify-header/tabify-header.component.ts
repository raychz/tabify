import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-tabify-header',
  templateUrl: './tabify-header.component.html',
  styleUrls: ['./tabify-header.component.scss'],
})
export class TabifyHeaderComponent implements OnInit {

  constructor(
    public menuController: MenuController,
    public navCtrl: NavController,
  ) { }

  ngOnInit() {}

  async openMenu() {
    await this.menuController.open();
  }

  async showNotifications() {
    await this.navCtrl.navigateForward('/home/notifications');
  }

}
