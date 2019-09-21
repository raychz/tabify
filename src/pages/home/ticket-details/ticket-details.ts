import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ActionSheetController, ModalController } from 'ionic-angular';
import { AuthService } from '../../../services/auth/auth.service';

@IonicPage()
@Component({
  selector: 'page-ticket-details',
  templateUrl: 'ticket-details.html',
})
export class TicketDetailsPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthService,
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  async ionViewDidLoad() {

  }
}
