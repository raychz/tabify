import { Component } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/services/auth/auth.service';
import { CanActivate } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage implements CanActivate {
  constructor(
    public tabsService: TabsService,
    public auth: AuthService,
    public navCtrl: NavController,
  ) {}

  public canActivate() {
    // move auth logic from app component to here and welcome
    return true;
  }

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
    this.navCtrl.navigateRoot('auth');
  }

  public logout() {
    this.auth.signOut();
  }

}
