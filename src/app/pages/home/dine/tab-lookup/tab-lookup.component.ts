import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NavController, PopoverController } from '@ionic/angular';
import { LocationService } from 'src/services/location/location.service';
import { AblyTicketService } from 'src/services/ticket/ably-ticket.service';
import { Ticket } from 'src/interfaces/ticket.interface';
import { TicketMode } from '../../../../../enums/index';
import { HelpTextComponent } from './help-text/help-text.component';

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
    mode: ['', Validators.compose([Validators.required])],
    partySize: ['', Validators.compose([Validators.required])],
  });

  constructor(
    public fb: FormBuilder,
    public navCtrl: NavController,
    public locationService: LocationService,
    public popover: PopoverController,
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

  public validateTicketNumber(value: any) {
    this.newTicket = false;
    this.existingTicket = false;
    if (!value.ticketNumber) {
      this.errorMessage = 'Error: Please enter a valid ticket number.';
    } else {
      this.errorMessage = '';
    }
  }

  public async helpPopover(event: Event, helpText: string) {
    const popover = await this.popover.create({
      component: HelpTextComponent,
      event,
      cssClass: 'popover-help',
    });
    popover.present();
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
      } else {
        this.newTicket = true;
      }
      // await this.initializeTicketMetadata(ticket);
      // await this.initializeFirestoreTicketListeners(ticket);
    } catch (e) {
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
    // this.checkingTicketNumber = true;
    console.log(config);
    try {
      const ticket = await this.ablyTicketService.updateTicketConfig(config);
      if (ticket) {
        this.nextPage();
      } else {
        this.errorMessage = 'Error: Something went wrong - no ticket selected';
      }
    } catch (e) {
      if (e.stopErrorPropagation) { console.log(e); return; }
      if (e.status === 403) {
        this.errorMessage = 'Warning: Someone else already opened your ticket and your config was not set.';
        this.nextPage();
      } else {
        this.errorMessage = 'Error: ' + e.error.message;
        throw e;
      }
    }
  }

  async createTab(ticketNumber: number) {
    try {
      const newTicket = await this.ablyTicketService.createTicket(ticketNumber, this.locationService.selectedLocation.id, true);
      this.newTicket = true;
      return newTicket;
      // await this.initializeTicketMetadata(newTicket);
      // await this.initializeFirestoreTicketListeners(newTicket);
    } catch (e) {
      if (e.stopErrorPropagation) { console.log(e); return; } else {
        this.errorMessage = 'Error: ' + e.error.message;
      }
    }
  }
}
