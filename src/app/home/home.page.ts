import { Component } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage {
  constructor(
    public tabsService: TabsService,
    public auth: AuthService,
    public navCtrl: NavController,
  ) {}

  public ionViewDidEnter() {
    console.log('ionViewDidLoad HomePage');
  }

  public viewPaymentMethods() {
    this.navCtrl.navigateForward('home/payment-methods');
  }

  public viewPeople() {
    this.navCtrl.navigateForward('home/find-people');
  }

  public viewHelp() {
    this.navCtrl.navigateForward('home/help');
  }

  public viewSettings() {
    this.navCtrl.navigateForward('home/settings');
  }

  public viewHome() {
    this.navCtrl.navigateRoot('home');
  }

  public viewAuth() {
    this.navCtrl.navigateRoot('welcome');
  }

  public logout() {
    this.auth.signOut();
  }

}
