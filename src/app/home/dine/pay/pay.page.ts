import { Component, OnInit } from '@angular/core';
import { CanActivate, CanDeactivate, RouterStateSnapshot, ActivatedRouteSnapshot, UrlTree, Router } from '@angular/router';
import { AblyService } from 'src/services/ticket/ably.service';
import { AblyTicketService } from 'src/services/ticket/ably-ticket.service';

@Component({
  selector: 'app-pay',
  templateUrl: './pay.page.html',
  styleUrls: ['./pay.page.scss'],
})
export class PayPage implements CanActivate, CanDeactivate<PayPage>  {

  constructor(
    public ablyService: AblyService,
    public ablyTicketService: AblyTicketService,
    public router: Router,

  ) { }

  public async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    console.log('canActivate Pay Workflow');
    console.log('route is', route);
    console.log('state is', state);

    const splitUrl = state.url.split('?');
    const pathUrl = splitUrl[0];
    const queryParams = splitUrl[1];

    const match = '/pay';
    const splitIndex = pathUrl.indexOf(match);
    const preIndexUrl = pathUrl.substring(0, splitIndex);
    const postIndexUrl = pathUrl.substring(splitIndex);
    const urlSegments = postIndexUrl.split('/');
    console.log(urlSegments);
    const ticketNumber = parseInt(urlSegments[2], 10);

    console.log('ticketNumber is', ticketNumber);
    console.log(preIndexUrl);
    // the provided ticket number is either not valid or not already configured in ablyTicketService -> redirect back to dine/tab-lookup
    if (isNaN(ticketNumber)) {
      console.log('could not activate pay workflow -> redirecting back to dine page');
      const urlTree = this.router.parseUrl(`${preIndexUrl}`);
      console.log(urlTree);
      return urlTree;
    } else if (!this.ablyTicketService.ticket || this.ablyTicketService.ticket.ticket_number !== ticketNumber) {
      console.log('could not activate pay workflow -> redirecting back to dine page');
      const urlTree = this.router.parseUrl(`${preIndexUrl}?ticketNumber=${ticketNumber}`);
      console.log(urlTree);
      return urlTree;
    } else {
       // Subscribe to Ably ticket channel
      this.ablyService.connect();
      await this.ablyTicketService.subscribeToTicketUpdates(this.ablyTicketService.ticket.id);
      return true;
    }
  }

  public async canDeactivate(
    component: PayPage,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    console.log('canDeactivate Pay Workflow');
    console.log('component is', component);
    console.log('currentRoute is', currentRoute);
    console.log('currentState is', currentState);
    console.log('nextState is', nextState);

    this.ablyTicketService.clearState();
    this.ablyService.disconnect();
    return true;
  }
}
