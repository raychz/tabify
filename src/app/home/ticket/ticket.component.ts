import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { sleep } from 'src/utilities/general.utilities';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit {
  @Input()
  imageUrl: string;

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
    public fb: FormBuilder
  ) { }

  ngOnInit() {}

  // add ticket logic control to this function
  async enterTicketNumber(ticketNumber: string) {
    this.newTicket = false;
    this.existingTicket = false;
    this.errorMessage = '';
    this.checkingTicketNumber = true;
    await sleep(2500);
    this.checkingTicketNumber = false;
    if (ticketNumber === '') {
      this.errorMessage = 'Error: Please enter a valid ticket number.';
    } else {
      // this.newTicket = true;
      this.existingTicket = true;
    }

  }

  changeMode(mode: string) {
    if (mode === 'full') {

    }
  }

}
