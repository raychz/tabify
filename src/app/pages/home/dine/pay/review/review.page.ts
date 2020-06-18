import { Component, OnInit } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';
import { NavController } from '@ionic/angular';
import { LocationService } from 'src/services/location/location.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.page.html',
  styleUrls: ['./review.page.scss'],
})
export class ReviewPage {

  constructor(
    public navCtrl: NavController,
    public locationService: LocationService,
  ) { }

  public ionViewDidEnter() {
  }

  public async nextPage() {
    this.navCtrl.navigateRoot(`home/dine/${this.locationService.selectedLocation.slug}`);
  }

}
