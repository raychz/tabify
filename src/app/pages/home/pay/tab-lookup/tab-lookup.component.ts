import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { sleep } from 'src/utilities/general.utilities';

@Component({
  selector: 'app-tab-lookup',
  templateUrl: './tab-lookup.component.html',
  styleUrls: ['./tab-lookup.component.scss'],
})
export class TabLookupComponent implements OnInit {
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
    public fb: FormBuilder,
    public router: Router,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    console.log(this.router.config[1].children);
  }

  async navigate() {
    console.log(this.router);
    await this.router.navigate(['select'], {relativeTo: this.route});
  }

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
