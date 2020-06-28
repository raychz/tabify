import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-socialize',
  templateUrl: 'socialize.page.html',
  styleUrls: ['socialize.page.scss']
})
export class SocializePage {
  showNewFeed = true;

  constructor(
    public navCtrl: NavController
  ) {}

  public ionViewDidEnter() {
  }

  async searchUsers(ev: any) {
    const search = ev.target.value;
    if (search && search.trim() !== '') {
      // const modifiedSearch = search.toLowerCase().replace(/[^a-zA-Z\d\s]/gi, '');
      // this.filteredLocations = this.locationService.locations.filter((location) => {
      //   const locationName = location.name.toLowerCase().replace(/[^a-zA-Z\d\s]/gi, '');
      //   return (locationName.indexOf(modifiedSearch) > -1);
      // });
      this.showNewFeed = false;
    } else {
      this.showNewFeed = true;
    }
  }

  public userProfile() {
    this.navCtrl.navigateForward('home/socialize/someUsername');
  }
}
