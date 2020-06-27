import { Component } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage {
  constructor(
    public tabsService: TabsService,
    public navCtrl: NavController,
  ) {}

  public ionViewDidEnter() {
    console.log('ionViewDidLoad HomePage');
  }

  public viewPaymentMethods() {
    this.navCtrl.navigateForward('home/payment-methods');
  }

  public viewHelp() {
    this.navCtrl.navigateForward('home/help');
  }

  public viewHome() {
    this.navCtrl.navigateRoot('home');
  }

  public viewAuth() {
    this.navCtrl.navigateRoot('welcome');
  }

  public logout() {
    // ToDo: add auth logout logic here
    this.viewAuth();
  }

}
