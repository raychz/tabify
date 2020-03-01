import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AuthService } from '../../../services/auth/auth.service';
import { TicketService, UserStatus } from '../../../services/ticket/ticket.service';
import { AlertService } from '../../../services/utilities/alert.service';
import { Location } from '../../../interfaces/location.interface';
import { LocationService } from '../../../services/location/location.service';
import { FraudPreventionCode } from '../../../interfaces/fraud-prevention-code.interface';
import { tap } from 'rxjs/operators';
import { AblyService } from '../../../services/ticket/ably.service';
import { AblyTicketService } from '../../../services/ticket/ably-ticket.service';
import { TicketUserStatus } from '../../../enums';

@IonicPage()
@Component({
  selector: 'page-tab-lookup',
  templateUrl: 'tab-lookup.html',
})
export class TabLookupPage {
  location: Location = this.navParams.data;
  tabForm: FormGroup;
  fraudPreventionCode: FraudPreventionCode;
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
    public ablyService: AblyService,
    public ablyTicketService: AblyTicketService,
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
    this.ablyService.connect();
  }

  async ionViewWillUnload() {
    // await this.ablyTicketService.clearState();
    this.ablyService.disconnect();
    console.log("ion view will unload tab-lookup!");
  }

  getDateTime() {
    setInterval(() => {
      this.dateTime = Date.now();
    }, 1000);
  }

  async findTab() {
    let { ticketNumber } = this.tabForm.value;

    ticketNumber = Number(ticketNumber.replace(/\D/g, ''));

    if (isNaN(ticketNumber) || !this.location.id) {
      const alert = this.alertCtrl.create({
        title: 'Error',
        message: 'Sorry, this ticket number doesn\'t look right. Please double-check and try again. If this issue persists, please contact support@tabifyapp.com.',
        buttons: ['OK']
      });
      alert.present();
      return;
    }

    const loading = this.loader.create();
    try {
      await loading.present();
      const ticket = await this.ticketService.getTicket(ticketNumber, this.location.id, 'open', true) as any;
      await this.initializeTicketMetadata(ticket);
      // await this.initializeFirestoreTicketListeners(ticket);
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
          message: 'Sorry, something went wrong. Please try again.',
          buttons: ['OK']
        });
        alert.present();
        throw e;
      }
    }
  }

  async createTab(ticketNumber: number) {
    const loading = this.loader.create();
    await loading.present();
    try {
      const newTicket = await this.ticketService.createTicket(ticketNumber, this.location.id, true) as any;
      await this.initializeTicketMetadata(newTicket);
      // await this.initializeFirestoreTicketListeners(newTicket);
      await loading.dismiss();
    } catch (e) {
      await loading.dismiss();
      if (e.stopErrorPropagation) return;
      if (e.status === 404) {
        const alert = this.alertCtrl.create({
          title: 'Ticket Not Found',
          message: 'Please check your ticket number or location and try again.',
          buttons: ['OK']
        });
        alert.present();
      } else if (e.status === 422) {
        const alert = this.alertCtrl.create({
          title: 'Error',
          message: e.error.message,
          buttons: ['OK']
        });
        alert.present();
      } else {
        const alert = this.alertCtrl.create({
          title: 'Error',
          message: 'Sorry, something went wrong. Please try again.',
          buttons: ['OK']
        });
        alert.present();
        throw e;
      }
    }
  }

  private async viewNextPage() {
    const currentUser = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid());
    switch (currentUser.status) {
      case TicketUserStatus.SELECTING:
        this.navCtrl.push('SelectItemsPage');
        break;
      case TicketUserStatus.WAITING:
        this.navCtrl.push('WaitingRoomPage', { pushSelectItemsOnBack: true });
        break;
      case TicketUserStatus.CONFIRMED:
        this.navCtrl.push('WaitingRoomPage', { pushSelectItemsOnBack: true });
        break;
      case TicketUserStatus.PAYING:
        this.navCtrl.push('TaxTipPage');
        break;
      case TicketUserStatus.PAID:
          this.navCtrl.push('StatusPage');
        break;
      default:
        throw new Error('Unknown user status')
    }
  }

  async getFraudPreventionCode() {
    const loading = this.loader.create();
    await loading.present();
    try {
      const result = await this.locationService.getFraudPreventionCode();
      this.fraudPreventionCode = result;
      await loading.dismiss();
    } catch (e) {
      console.log(e);
      await loading.dismiss();
      throw e;
    }
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
    this.ablyTicketService.ticket = ticket;
    this.ablyTicketService.synchronizeFrontendTicket();
    this.ablyTicketService.synchronizeFrontendTicketItems();

    // Subscribe to Ably ticket channel
    await this.ablyTicketService.subscribeToTicketUpdates(ticket.id);

    // Add user to database ticket
    try {
      const newTicketUser = await this.ticketService.addUserToDatabaseTicket(ticket.id);
      this.ablyTicketService.onTicketUserAdded(newTicketUser);
    } catch (e) {
      if (e.status === 403) {
        const alert = this.alertCtrl.create({
          title: 'Error',
          message: e.error.message,
          buttons: ['OK']
        });
        alert.present();
      }
      e.stopErrorPropagation = true;
      throw e;
    }

    // Add user to Firestore ticket
    // try {
    //   await this.ticketService.addUserToFirestoreTicket(ticket.id);
    // } catch (e) {
    //   if (e.status === 403) {
    //     const alert = this.alertCtrl.create({
    //       title: 'Error',
    //       message: e.error.message,
    //       buttons: ['OK']
    //     });
    //     alert.present();
    //   }
    //   e.stopErrorPropagation = true;
    //   throw e;
    // }

    // Add ticket number to fraud code
    await this.ticketService.addTicketNumberToFraudCode(ticket.id, this.fraudPreventionCode.id);

    await this.viewNextPage();
    // Get ticket
    // await this.ablyTicketService.getTicket(ticket.id);
  }
}
