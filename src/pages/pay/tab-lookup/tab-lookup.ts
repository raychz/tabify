import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AuthService } from '../../../services/auth/auth.service';
import { SocketService } from '../../../services/socket/socket.service';
import { TicketService, UserStatus } from '../../../services/ticket/ticket.service';
import { AlertService } from '../../../services/utilities/alert.service';
import { ILocation } from '../../../interfaces/location.interface';
import { LocationService } from '../../../services/location/location.service';
import { IFraudPreventionCode } from '../../../interfaces/fraud-prevention-code.interface';

@IonicPage()
@Component({
  selector: 'page-tab-lookup',
  templateUrl: 'tab-lookup.html',
})
export class TabLookupPage {
  location: ILocation = this.navParams.data;
  tabForm: FormGroup;
  fraudPreventionCode!: IFraudPreventionCode;
  dateTime: number = Date.now();
  isCodeVisible = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public loader: LoaderService,
    public auth: AuthService,
    public socketService: SocketService,
    public ticketService: TicketService,
    public alertCtrl: AlertService,
    public locationService: LocationService,
  ) {
    this.tabForm = fb.group({
      tabNumber: ['', Validators.compose([Validators.required])],
    });
  }

  async ionViewDidLoad() {
    await this.loader.present();
    this.getDateTime();
    await this.getFraudPreventionCode();
    await this.loader.dismiss();
  }

  getDateTime() {
    setInterval(() => {
      this.dateTime = Date.now();
    }, 1000);
  }

  async findTab() {
    const { tabNumber } = this.tabForm.value;

    this.loader.present();
    const { error, ticket } = await
      this.ticketService
        .getTicket(tabNumber, this.location.omnivore_id, this.fraudPreventionCode) as { error: any, ticket: any };

        console.log(tabNumber);
        console.log(this.location.omnivore_id);
        console.log(this.fraudPreventionCode);

    if (error || !ticket) {
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
    this.ticketService.initializeFirestoreTicket(ticket.id);
  }

  private async viewSelectItems() {
    this.ticketService.changeUserStatus(UserStatus.Selecting);
    await this.navCtrl.push('SelectItemsPage');
    await this.loader.dismiss();
  }

  async getFraudPreventionCode() {
    try {
      const result = await this.locationService.getFraudPreventionCode();
      this.fraudPreventionCode = result
    } catch (error) {
      console.log(error);
    }
  }
}
