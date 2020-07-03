import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/services/auth/auth.service';
import { CanActivate, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})

export class HomePage {
  viewTabs = true;

  // routes that have any of following as their last path element will show the tabs
  private showTabBarPages: string[] = [
    'dine', 'explore', 'socialize'
  ];

  // routes that have any of following as their second to last path element (last may be a dynamic path) will show the tabs
  private showTabBarParamPage: string[] = [
    'dine',
  ];

  constructor(
    public auth: AuthService,
    public navCtrl: NavController,
    public router: Router,
  ) {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((event: any) => {
      this.showHideTabs(event.urlAfterRedirects);
    });
  }

    private showHideTabs(url: string) {
      console.log('determing if we should show tabs for: ', url);
      // Split the URL up into an array and get last page
      const urlArray = url.split('/');
      const pageUrl = urlArray[urlArray.length - 1] ;
      const pageUrlParent = urlArray[urlArray.length - 2];

      // remove any query params at the end
      const page = pageUrl.split('?')[0];
      const showPage = this.showTabBarPages.indexOf(page) > -1;
      const showParamPage = this.showTabBarParamPage.indexOf(pageUrlParent) > -1;

      try {
        showPage || showParamPage ? this.showTabs() : this.hideTabs();
      } catch (err) {
        console.log(err);
      }
    }

  public hideTabs() {
    this.viewTabs = false;
  }

  public showTabs() {
    this.viewTabs = true;
  }

  public ionViewDidEnter() {
    console.log('ionViewDidLoad HomePage');
  }
}
