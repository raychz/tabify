import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { sleep } from 'src/utilities/general.utilities';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
})
export class TicketComponent implements OnInit {
  checkingTicketNumber = false;
  existingTicket = false;
  newTicket = false;

  tabForm: FormGroup = this.fb.group({
    ticketNumber: ['', Validators.compose([Validators.required])],
  });
  newTicketForm: FormGroup = this.fb.group({
    modeOfSplitting: ['', Validators.compose([Validators.required])],
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
    this.checkingTicketNumber = true;
    await sleep(2500);
    this.checkingTicketNumber = false;
    this.newTicket = true;
    // this.existingTicket = true;
  }

}
