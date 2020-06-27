import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, ToastController } from '@ionic/angular';
import { LocationService } from 'src/services/location/location.service';
import { AblyTicketService } from 'src/services/ticket/ably-ticket.service';
import { Ticket } from 'src/interfaces/ticket.interface';
import { TicketMode } from '../../../../../enums/index';
import { Router } from '@angular/router';
import { AblyService } from 'src/services/ticket/ably.service';

@Component({
  selector: 'app-tab-lookup',
  templateUrl: './tab-lookup.component.html',
  styleUrls: ['./tab-lookup.component.scss'],
})
export class TabLookupComponent implements OnInit {
  checkingTicketNumber = false;
  existingTicket = false;
  newTicket = false;
  errorMessage = '';

  // expose enums to template
  ticketMode = TicketMode;

  tabForm: FormGroup = this.fb.group({
    ticketNumber: ['', Validators.compose([Validators.required])],
  });
  newTicketForm: FormGroup = this.fb.group({
    // validators not working for mode enum/radio
    mode: [TicketMode.ITEMIZE, Validators.compose([Validators.required])],
    partySize: ['', Validators.compose([Validators.required])],
  });

  constructor(
    public fb: FormBuilder,
    public navCtrl: NavController,
    public locationService: LocationService,
    public router: Router,
    public toastController: ToastController,
    public ablyService: AblyService,
    public ablyTicketService: AblyTicketService,
  ) { }

  public ngOnInit() {
    this.newTicket = false;
    this.existingTicket = false;
    this.errorMessage = '';
    this.checkingTicketNumber = false;
  }

  public async nextPage() {
    console.log('in next page');
    await this.navCtrl.navigateForward(`home/dine/${this.locationService.selectedLocation.slug}/pay`);
  }

  private async initializeTicketMetadata() {
    console.log('1');
    this.ablyTicketService.synchronizeFrontendTicket();
    console.log('2');
    this.ablyTicketService.synchronizeFrontendTicketItems();
    console.log('3');

    // Subscribe to Ably ticket channel - ToDo: move ably connection logic to pay workflow
    this.ablyService.connect();
    await this.ablyTicketService.subscribeToTicketUpdates(this.ablyTicketService.ticket.id);

    // Add user to database ticket
    console.log('adding user');
    const newTicketUser = await this.ablyTicketService.addUserToDatabaseTicket();
    this.ablyTicketService.onTicketUserAdded(newTicketUser);
    // await this.ticketService.addTicketNumberToFraudCode(ticket.id, this.fraudPreventionCode.id);
    this.nextPage();

  }

  public validateTicketNumber(value: any) {
    this.newTicket = false;
    this.existingTicket = false;
    if (!value.ticketNumber) {
      this.errorMessage = 'Error: Please enter a valid ticket number.';
    } else {
      this.errorMessage = '';
    }
  }

  public async helpToast(message: string, duration: number) {
    const toast = await this.toastController.create({
      message,
      duration,
      animated: true,
    });
    toast.present();
  }

  public async enterTicketNumber(value: any) {
    console.log(value.ticketNumber);

    this.newTicket = false;
    this.existingTicket = false;
    this.errorMessage = '';
    this.checkingTicketNumber = true;

    if (!this.locationService.selectedLocation) {
      console.log('Can not search for ticket, location not selected');
      return;
    }
    let ticket: Ticket;
    try {
      ticket = await this.ablyTicketService.searchTicket(
        value.ticketNumber, this.locationService.selectedLocation.id, 'open', true
      ) as Ticket;
      if (ticket.mode) {
        this.existingTicket = true;
        await this.initializeTicketMetadata();
      } else {
        this.newTicket = true;
      }
    } catch (e) {
      console.log(e);
      if (e.stopErrorPropagation) { console.log(e); return; }
      if (e.status === 404) {
        // Two things could've happened here.
        // 1. This could be the first user joining the tab, so we have to first fetch the data from Omnivore and save in our db
        // 2. The user could've entered the wrong ticket #
        // Let's first check for #1
        ticket = await this.createTab(value.ticketNumber);
      } else {
        this.errorMessage = 'Error: ' + e.error.message;
        this.checkingTicketNumber = false;
        throw e;
      }
    }
    console.log('ticket is', ticket);
    this.checkingTicketNumber = false;
    return ticket;
  }

  public async updateTicketConfig(config: {mode: TicketMode, partySize: number}) {
    this.checkingTicketNumber = true;
    console.log(config);
    try {
      const ticket = await this.ablyTicketService.updateTicketConfig(config);
      await this.initializeTicketMetadata();
    } catch (e) {
      console.log(e);
      if (e.stopErrorPropagation) { console.log(e); return; }
      if (e.status === 403) {
        this.newTicket = false;
        this.errorMessage = 'Error: Someone else already set the ticket config before you. Joining ticket now...';
        await this.initializeTicketMetadata();
      } else {
        this.errorMessage = 'Error: ' + e.error.message;
        throw e;
      }
    }
    this.checkingTicketNumber = false;
  }

  async createTab(ticketNumber: number) {
    try {
      const newTicket = await this.ablyTicketService.createTicket(ticketNumber, this.locationService.selectedLocation.id, true);
      this.newTicket = true;
      return newTicket;
    } catch (e) {
      console.log(e);
      if (e.stopErrorPropagation) { console.log(e); return; } else {
        this.errorMessage = 'Error: ' + e.error.message;
      }
    }
  }
}
