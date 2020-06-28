import { Component, OnInit } from '@angular/core';
import { TabsService } from 'src/services/tabs/tabs.service';
import { NavController, ToastController } from '@ionic/angular';
import { LocationService } from 'src/services/location/location.service';
import { AblyTicketService } from 'src/services/ticket/ably-ticket.service';
import { AuthService } from 'src/services/auth/auth.service';
import { PaymentMethodService } from 'src/services/payment/payment-method.service';
import { CouponService } from 'src/services/coupon/coupon.service';
import { LoaderService } from 'src/services/utilities/loader.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage {
  currentUserUid = this.auth.getUid();
  currentTicketUser = this.ablyTicketService.ticket.usersMap.get(this.currentUserUid);

  constructor(
    public navCtrl: NavController,
    public locationService: LocationService,
    public paymentMethodService: PaymentMethodService,
    public couponService: CouponService,
    public toastController: ToastController,
    public loader: LoaderService,
    public ablyTicketService: AblyTicketService,
    public auth: AuthService,
  ) { }

  public async ionViewDidEnter() {
    const loading = await this.loader.create();
    loading.present();
    // TODO: Enter the user's default tip percentage here
    const currentUser = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid());
    currentUser.tipPercentage = 20;
    currentUser.tips =
      Math.round(((currentUser.tipPercentage / 100) * currentUser.items));
    try {
      await this.paymentMethodService.initializePaymentMethods();
    } catch (e) {
      console.error('Caught in initializePaymentMethods', e);
      throw e;
    }

    // TODO: Auto select the user's default payment method here
    if (this.paymentMethodService.paymentMethods.length) {
      currentUser.paymentMethod = this.paymentMethodService.paymentMethods[0];
    }
    const message = await this.couponService.getTicketCoupons(this.ablyTicketService.ticket.id);
    console.log(message);
    // alert is posssibly undefined
    await loading.dismiss();
  }

  public async helpToast(message: string, duration: number) {
    const toast = await this.toastController.create({
      message,
      duration,
      animated: true,
    });
    toast.present();
  }

  public async nextPage() {
    await this.navCtrl.navigateForward(`/home/dine/${this.locationService.selectedLocation.slug}/pay/review`);
  }

  public adjustTip() {
    console.log('tip edit not yet implemented');
  }
  public editPaymentMethod() {
    console.log('payment methods not implemented');
  }

}
