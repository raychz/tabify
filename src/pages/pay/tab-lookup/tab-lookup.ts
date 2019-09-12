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
import { tap } from 'rxjs/operators';

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
        console.log(this.ticketService.firestoreStatus$.getValue())
    if (this.ticketService.firestoreStatus$.getValue()) {
      this.viewNextPage();
    } else {
      this.ticketService.firestoreStatus$.pipe(tap((fireStoreInitializationStatus) => {
        if (fireStoreInitializationStatus) {
          this.viewNextPage();
        }
      })).subscribe();
    }
    this.ticketService.initializeFirestoreTicket(ticket.id);
  }

  private async viewNextPage() {
      switch (this.ticketService.curUser.status) {
        case UserStatus.Selecting:
          this.navCtrl.push('SelectItemsPage');
          break;
        case UserStatus.Waiting:
          this.navCtrl.push('WaitingRoomPage', {confirmed: false, pushSelectItemsOnBack: true});
          break;
        case UserStatus.Confirmed:
          this.navCtrl.push('WaitingRoomPage', {confirmed: true, pushSelectItemsOnBack: true});
          break;
        case UserStatus.Paying:
          this.navCtrl.push('TaxTipPage');
          break;
        case UserStatus.Paid:
            const modal = this.alertCtrl.create({
              title: 'Tab already paid!',
              message: 'You have already paid your tab, no need to do anything else.',
              buttons: [
                {
                  text: 'Ok',
                },
              ],
            });
            modal.present();
          break;
        default:
          throw new Error('Unknown user status')
      }

    await this.loader.dismiss();
    this.ticketService.firestoreStatus$.complete();
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
