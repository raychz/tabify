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
      ticketNumber: ['', Validators.compose([Validators.required])],
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
    const { ticketNumber } = this.tabForm.value;

    const loading = this.loader.create();
    try {
      await loading.present();
      const ticket = await this.ticketService.getTicket(ticketNumber, this.location.id, 'open') as any;
      await this.initializeTicketMetadata(ticket);
      await this.initializeFirestoreTicketListeners(ticket);
      await loading.dismiss();
    } catch (e) {
      await loading.dismiss();
      if (e.stopErrorPropagation) return;
      if (e.status === 404) {
        // Two things could've happened here.
        // 1. This could be the first user joining the tab, so we have to first fetch the data from Omnivore and save in our db
        // 2. The user could've entered the wrong ticket #
        // Let's first check for #1
        await this.createTab(ticketNumber);
      } else {
        const alert = this.alertCtrl.create({
          title: 'Error',
          message: 'Whoops, something went wrong on our end! Please try again.',
          buttons: ['Ok']
        });
        alert.present();
      }
    }
  }

  async createTab(ticketNumber: number) {
    const loading = this.loader.create();
    await loading.present();
    try {
      const newTicket = await this.ticketService.createTicket(ticketNumber, this.location.id) as any;
      await this.initializeTicketMetadata(newTicket);
      await this.initializeFirestoreTicketListeners(newTicket);
      await loading.dismiss();
    } catch (e) {
      await loading.dismiss();
      if (e.stopErrorPropagation) return;
      if (e.status === 404) {
        const alert = this.alertCtrl.create({
          title: 'Ticket Not Found',
          message: 'Please check your ticket number or location and try again.',
          buttons: ['Ok']
        });
        alert.present();
      } else if (e.status === 422) {
        const alert = this.alertCtrl.create({
          title: 'Error',
          message: e.error.message,
          buttons: ['Ok']
        });
        alert.present();
      } else {
        const alert = this.alertCtrl.create({
          title: 'Error',
          message: 'Whoops, something went wrong on our end! Please try again.',
          buttons: ['Ok']
        });
        alert.present();
      }
    }
  }

  private async viewNextPage() {
    console.log(this.ticketService.curUser.status);
    switch (this.ticketService.curUser.status) {
      case UserStatus.Selecting:
        this.navCtrl.push('SelectItemsPage');
        break;
      case UserStatus.Waiting:
        this.navCtrl.push('SelectItemsPage');
        this.navCtrl.push('WaitingRoomPage', { confirmed: false, pushSelectItemsOnBack: true });
        break;
      case UserStatus.Confirmed:
        this.navCtrl.push('SelectItemsPage');
        this.navCtrl.push('WaitingRoomPage', { confirmed: true, pushSelectItemsOnBack: true });
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

  private async initializeFirestoreTicketListeners(ticket: any) {
    const loading = this.loader.create();
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
    this.ticketService.initializeFirestoreTicket(ticket.firestore_doc_id);
  }

  private async initializeTicketMetadata(ticket: any) {
    // Add user to database ticket
    await this.ticketService.addUserToDatabaseTicket(ticket.id);

    // Add user to Firestore ticket
    try {
      await this.ticketService.addUserToFirestoreTicket(ticket.id);
    } catch (e) {
      if (e.status === 403) {
        const alert = this.alertCtrl.create({
          title: 'Error',
          message: e.error.message,
          buttons: ['Ok']
        });
        alert.present();
      }
      e.stopErrorPropagation = true;
      throw e;
    }

    // Add ticket number to fraud code
    await this.ticketService.addTicketNumberToFraudCode(ticket.id, this.fraudPreventionCode.id);
  }
}
