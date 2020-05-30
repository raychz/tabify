import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { sleep } from 'src/utilities/general.utilities';
import { NavController } from '@ionic/angular';
import { LocationService } from 'src/services/location/location.service';
import { AblyTicketService } from 'src/services/ticket/ably-ticket.service';
import { Ticket } from 'src/interfaces/ticket.interface';
import { TicketMode } from '../../../../../enums/index';

@Component({
  selector: 'app-tab-lookup',
  templateUrl: './tab-lookup.component.html',
  styleUrls: ['./tab-lookup.component.scss'],
})
export class TabLookupComponent {
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
    ticketMode: ['', Validators.compose([Validators.required])],
    numberInParty: ['', Validators.compose([Validators.required])],
  });

  constructor(
    public fb: FormBuilder,
    public navCtrl: NavController,
    public locationService: LocationService,
    public ablyTicketService: AblyTicketService,
  ) { }

  public ionViewDidEnter() {
    this.newTicket = false;
    this.existingTicket = false;
    this.errorMessage = '';
    this.checkingTicketNumber = false;
  }

  public async nextPage() {
    await this.navCtrl.navigateForward('home/pay/select-items');
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
        throw e;
      }
    }
    console.log('ticket is', ticket);
    this.checkingTicketNumber = false;
    return ticket;
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
