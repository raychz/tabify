import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { sleep } from 'src/utilities/general.utilities';
import { NavController } from '@ionic/angular';
import { LocationService } from 'src/services/location/location.service';

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

  // add ticket logic control to this function
  public async enterTicketNumber(value: any) {
    console.log(value.ticketNumber);
    this.newTicket = false;
    this.existingTicket = false;
    this.errorMessage = '';
    this.checkingTicketNumber = true;
    await sleep(2500);
    this.checkingTicketNumber = false;
    // this.newTicket = true;
    this.existingTicket = true;

  }
}
