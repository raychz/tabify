import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthService } from '../../../services/auth/auth.service';
import { LoaderService } from '../../../services/utilities/loader.service';
import { TicketItemService } from '../../../services/ticket-item/ticket-item.service';

@IonicPage()
@Component({
  selector: 'page-ticket-details',
  templateUrl: 'ticket-details.html',
})
export class TicketDetailsPage {

  ticketItems: any[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private auth: AuthService,
    public loader: LoaderService,
    public alertCtrl: AlertController,
    public ticketItemService: TicketItemService
  ) { }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  async ionViewDidLoad() {
    await this.getTicketItems();
  }

  async getTicketItems() {
    this.loader.present();
    try {
      const ticketId = await this.navParams.get('ticketId');
      this.ticketItems = await this.ticketItemService.getTicketItems(ticketId);
      console.log(this.ticketItems);
    } catch {
      const alert = this.alertCtrl.create({
        title: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
    }
    this.loader.dismiss();

    return this.ticketItems;
  }

}
