import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AuthService } from '../../../services/auth/auth.service';
import { SocketService } from '../../../services/socket/socket.service';
import { TicketService } from '../../../services/ticket/ticket.service';
import { AlertService } from '../../../services/utilities/alert.service';
import { ILocation } from '../../../interfaces/location.interface';


@IonicPage()
@Component({
  selector: 'page-tab-lookup',
  templateUrl: 'tab-lookup.html',
})
export class TabLookupPage {
  location: ILocation = this.navParams.data;
  tabForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public loader: LoaderService,
    public auth: AuthService,
    public socketService: SocketService,
    public ticketService: TicketService,
    public alertCtrl: AlertService
  ) {
    this.tabForm = fb.group({
      tabNumber: ['', Validators.compose([Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabLookupPage');
  }

  async findTab() {
    const { tabNumber } = this.tabForm.value;
    
    this.loader.present();
    const { error, ticket } = await this.ticketService.getTicket(tabNumber, this.location.omnivore_id);
    
    if (error) {
      this.loader.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Tab Not Found',
        message: `Please check your ticket number or location and try again.`,
        buttons: ['Ok']
      });
      alert.present();
      return;
    }
    
    // await this.socketService.connect()
    this.loader.dismiss();
    this.navCtrl.push('SelectItemsPage', ticket);

  }
}
