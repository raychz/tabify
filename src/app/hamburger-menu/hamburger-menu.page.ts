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
  pages = [
    {
      url: 'home',
      title: 'Home',
      icon: 'home-outline',
    },
    {
      url: 'payment-methods',
      title: 'Payment Methods',
      icon: 'card-outline',
    },
    {
      url: 'auth',
      title: 'Log Out', // will be log in if guest authenticated
      icon: 'log-out-outline',
    },
    {
      url: 'help',
      title: 'Help',
      icon: 'help-outline',
    },
    {
      url: 'settings',
      title: 'Settings',
      icon: 'settings-outline',
    },
  ];

  constructor(
    public router: Router,
    public auth: AuthService,
    public navCtrl: NavController,
    ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;
        // remove first / of path
        if (this.selectedPath.startsWith('/')) {
          this.selectedPath = this.selectedPath.substring(1);
        }
      }
    });
  }

  ngOnInit() {
  }

  public openPage(page: any) {
    if (page.title === 'Log Out') {
      this.auth.signOut();
    }
    this.navCtrl.navigateRoot(page.url);
  }

}
