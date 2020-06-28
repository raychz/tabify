import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-socialize',
  templateUrl: 'socialize.page.html',
  styleUrls: ['socialize.page.scss']
})
export class SocializePage {

  constructor(
    public navCtrl: NavController
  ) {}

  public ionViewDidEnter() {
  }
}
