import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { AuthService } from 'src/services/auth/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.page.html',
  styleUrls: ['./hamburger-menu.page.scss'],
})
export class HamburgerMenuPage implements OnInit {
  selectedPath = '';
  pages: {title: string, icon: string, click: () => void}[];

  constructor(
    public router: Router,
    public auth: AuthService,
    public navCtrl: NavController,
    ) {
    // this.router.events.subscribe((event: RouterEvent) => {
    //   if (event && event.url) {
    //     this.selectedPath = event.url;
    //   }
    // });
  }

  ngOnInit() {
  }

  public viewPaymentMethods() {
    console.log(this.navCtrl);
    this.navCtrl.navigateRoot('payment-methods');
  }

  public viewHelp() {
    this.navCtrl.navigateRoot('help');
  }

  public viewSettings() {
    this.navCtrl.navigateRoot('settings');
  }

  public viewHome() {
    this.navCtrl.navigateRoot('home');
  }

  public viewAuth() {
    this.navCtrl.navigateRoot('auth');
  }

  public logout() {
    this.auth.signOut();
    this.viewAuth();
  }

}
