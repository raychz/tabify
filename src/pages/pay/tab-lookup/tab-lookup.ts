import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AuthService } from '../../../services/auth/auth.service';
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
  fraudPreventionCode: IFraudPreventionCode;
  dateTime: number = Date.now();
  isCodeVisible = false;


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public loader: LoaderService,
    public auth: AuthService,
    public ticketService: TicketService,
    public alertCtrl: AlertService,
    public locationService: LocationService,
  ) {
    this.tabForm = fb.group({
      tabNumber: ['', Validators.compose([Validators.required])],
    });
  }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  async ionViewDidLoad() {
    this.getDateTime();
    await this.getFraudPreventionCode();
  }

  getDateTime() {
    setInterval(() => {
      this.dateTime = Date.now();
    }, 1000);
  }

  async findTab() {
    const { tabNumber } = this.tabForm.value;

    let loading = this.loader.create();
    await loading.present();
    const { error, ticket } = await
      this.ticketService
        .getTicket(tabNumber, this.location.omnivore_id, this.fraudPreventionCode) as { error: any, ticket: any };
    await loading.dismiss();

    if (error || !ticket) {
      let alert;
      if (error.status === 403) {
        alert = this.alertCtrl.create({
          title: 'Unable to join tab',
          message: error.error.message,
          buttons: ['Ok']
        });
      } else {
        alert = this.alertCtrl.create({
          title: 'Tab Not Found',
          message: `Please check your ticket number or location and try again.`,
          buttons: ['Ok']
        });
      }
      alert.present();
      return;
    }

    loading = this.loader.create();
    await loading.present();
    if (this.ticketService.firestoreStatus$.getValue()) {
      this.viewNextPage();
      await loading.dismiss();
    } else {
      this.ticketService.firestoreStatus$.pipe(tap((fireStoreInitializationStatus) => {
        if (fireStoreInitializationStatus) {
          this.viewNextPage();
          loading.dismiss();
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
        this.navCtrl.push('SelectItemsPage');
        this.navCtrl.push('WaitingRoomPage');
        break;
      case UserStatus.Confirmed:
        this.navCtrl.push('SelectItemsPage');
        this.navCtrl.push('WaitingRoomPage');
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
    this.ticketService.firestoreStatus$.complete();
  }

  async getFraudPreventionCode() {
    const loading = this.loader.create();
    await loading.present();
    try {
      const result = await this.locationService.getFraudPreventionCode();
      this.fraudPreventionCode = result
    } catch (error) {
      console.log(error);
    }
    await loading.dismiss();
  }
}
