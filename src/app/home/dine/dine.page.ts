import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { LocationService } from 'src/services/location/location.service';
import { Location } from 'src/interfaces/location.interface';
import { LoaderService } from 'src/services/utilities/loader.service';
import { AuthService } from 'src/services/auth/auth.service';
import { AlertService } from 'src/services/utilities/alert.service';
import { PopoverController, IonCard, NavController, ToastController } from '@ionic/angular';
import { CanActivate, ActivatedRoute, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TicketMode } from 'src/enums';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AblyTicketService } from 'src/services/ticket/ably-ticket.service';
import { AblyService } from 'src/services/ticket/ably.service';
import { Ticket } from 'src/interfaces/ticket.interface';

@Component({
  selector: 'app-dine',
  templateUrl: 'dine.page.html',
  styleUrls: ['dine.page.scss']
})
export class DinePage implements CanActivate, OnInit, OnDestroy {
  queryParamsObservable: Subscription;
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
    public locationService: LocationService,
    public loader: LoaderService,
    public auth: AuthService,
    public router: Router,
    public navCtrl: NavController,
    public popover: PopoverController,
    public alertCtrl: AlertService,
    public activatedRoute: ActivatedRoute,
    public fb: FormBuilder,
    public toastController: ToastController,
    public ablyService: AblyService,
    public ablyTicketService: AblyTicketService,
  ) {}

  // public ionViewCanEnter(): boolean {
  //   return this.auth.authenticated;
  // }

  public ngOnInit() {
    this.clearState();

    this.queryParamsObservable = this.activatedRoute
        .queryParams
        .subscribe(params => {
          console.log(params);
          if (params.ticketNumber) {
            const tabFormValue = {ticketNumber: params.ticketNumber};
            this.tabForm.setValue(tabFormValue);
            this.enterTicketNumber(tabFormValue);
          }
        });
  }

  public ngOnDestroy() {
    this.queryParamsObservable.unsubscribe();
  }

  // bug - this causes an infinite loop if selected location slug is an empty sting
  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    // maybe somehow parametize match variable and reuse this location gaurd in places like home/explore/:locationSlug where we show reviews
    const splitUrl = state.url.split('?');
    const pathUrl = splitUrl[0];
    let queryParams = splitUrl[1];

    if (!queryParams) {
      queryParams = '';
    } else {
      queryParams = '?' + queryParams;
     }

    const match = '/dine';
    const splitIndex = pathUrl.indexOf(match) + match.length;
    const preIndexUrl = pathUrl.substring(0, splitIndex);
    const postIndexUrl = pathUrl.substring(splitIndex);
    const urlSegments = postIndexUrl.split('/');
    const locationSlug = urlSegments[1];

    if (!this.locationService.locations) {
      await this.locationService.getLocations();
    }

    if (locationSlug) {
      const findLoc = {slug: locationSlug} as Location;
      const selectedLoc = this.locationService.selectLocation(findLoc);

      if (selectedLoc.slug === locationSlug) {
        return true;
      } else {
        urlSegments[1] = selectedLoc.slug;
        return this.router.parseUrl(`${preIndexUrl}${urlSegments.join('/')}${queryParams}`);
      }
    } else {
      const location = await this.locationService.selectDefaultLocation();
      urlSegments[1] = location.slug;
      return this.router.parseUrl(`${preIndexUrl}${urlSegments.join('/')}${queryParams}`);
    }
  }

  public async ionViewDidEnter() {
    console.log('ionViewDidLoad DinePage');
    console.log(this.locationService.selectedLocation);
    // await this.auth.signInWithEmail({email: '', password: ''});
  }

  public async showLocations() {
    await this.navCtrl.navigateForward('home/dine/locations');
    // await this.router.navigate(['home', 'dine', 'locations']);
    // await this.router.
  }

  public async viewMenu() {
    await this.navCtrl.navigateForward(`home/dine/${this.locationService.selectedLocation.slug}/menu`);
  }

  public async nextPage() {
    console.log('in next page');
    await this.navCtrl.navigateForward(`home/dine/${this.locationService.selectedLocation.slug}/pay/${this.ablyTicketService.ticket.ticket_number}`);
  }

  public async clearState() {
    this.tabForm.reset();
    this.newTicketForm.reset();
    this.newTicket = false;
    this.existingTicket = false;
    this.errorMessage = '';
    this.checkingTicketNumber = false;
  }

  private async initializeTicketMetadata() {
    console.log('1');
    this.ablyTicketService.synchronizeFrontendTicket();
    console.log('2');
    this.ablyTicketService.synchronizeFrontendTicketItems();
    console.log('3');

    // Add user to database ticket
    console.log('adding user');
    const newTicketUser = await this.ablyTicketService.addUserToDatabaseTicket();
    this.ablyTicketService.onTicketUserAdded(newTicketUser);
    // await this.ticketService.addTicketNumberToFraudCode(ticket.id, this.fraudPreventionCode.id);
    this.nextPage();
    this.clearState();
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
