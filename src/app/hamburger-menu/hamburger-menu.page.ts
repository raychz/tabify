import { Component, OnInit } from '@angular/core';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/services/auth/auth.service';
import { NavController } from '@ionic/angular';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-hamburger-menu',
  templateUrl: './hamburger-menu.page.html',
  styleUrls: ['./hamburger-menu.page.scss'],
})
export class HamburgerMenuPage implements OnInit {
  selectedPath = '';
  viewSplitPane = true;

  // routes that have any of following as their last path element will hide the split pane
  private hideSplitPanePages: string[] = [
    'select', 'confirm', 'review'
  ];

  // routes that have any of following as their second to last path element (last may be a dynamic path) will hide the split pane
  private hideSplitPaneParamPage: string[] = [

  ];

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
      url: 'help',
      title: 'Help',
      icon: 'help-outline',
    },
    {
      url: 'settings',
      title: 'Settings',
      icon: 'settings-outline',
    },
    {
      url: 'auth',
      title: 'Log Out', // will be log in if guest authenticated
      icon: 'log-out-outline',
    },
  ];

  constructor(
    public router: Router,
    public auth: AuthService,
    public navCtrl: NavController,
    ) {
      this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((event: any) => {
          this.selectedPath = event.urlAfterRedirects;
          // remove first / of path for menu page matching purposes -> styles the menu selected menu item
          if (this.selectedPath.startsWith('/')) {
            this.selectedPath = this.selectedPath.substring(1);
          }
          this.showHideSplitPane(this.selectedPath);
      });
    }

  ngOnInit() {
  }

  private showHideSplitPane(url: string) {
    console.log('determing if we should hide split pane for: ', url);
    // Split the URL up into an array and get last page
    const urlArray = url.split('/');
    const pageUrl = urlArray[urlArray.length - 1] ;
    const pageUrlParent = urlArray[urlArray.length - 2];

    // remove any query params at the end
    const page = pageUrl.split('?')[0];
    const hidePage = this.hideSplitPanePages.indexOf(page) > -1;
    const hideParamPage = this.hideSplitPaneParamPage.indexOf(pageUrlParent) > -1;

    try {
      hidePage || hideParamPage ? this.hideSplitPane() : this.showSplitPane();
    } catch (err) {
      console.log(err);
    }
  }

public hideSplitPane() {
  this.viewSplitPane = false;
}

public showSplitPane() {
  this.viewSplitPane = true;
}

  public openPage(page: any) {
    if (page.title === 'Log Out') {
      this.auth.signOut();
    }
    this.navCtrl.navigateRoot(page.url);
  }

}
