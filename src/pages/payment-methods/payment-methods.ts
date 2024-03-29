import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import { PaymentDetailsPageMode } from "./payment-details/payment-details";
import { PaymentMethodService } from '../../services/payment/payment-method.service';
import { AlertService } from '../../services/utilities/alert.service';
import { LoaderService } from '../../services/utilities/loader.service';
import { AuthService } from '../../services/auth/auth.service';

@IonicPage()
@Component({
  selector: 'page-payment-methods',
  templateUrl: 'payment-methods.html',
})
export class PaymentMethodsPage {
  mode: PaymentDetailsPageMode;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public paymentMethodService: PaymentMethodService,
    private actionSheetCtrl: ActionSheetController,
    public alertCtrl: AlertService,
    public loader: LoaderService,
    public auth: AuthService
  ) {
    this.mode = navParams.get('mode');
  }

  async ionViewDidLoad() {
    await this.paymentMethodService.initializePaymentMethods();
  }

  public ionViewCanEnter(): boolean {
    return this.auth.authenticated;
  }

  addNewCard() {
    this.navCtrl.push('PaymentDetailsPage', {
      title: 'Add New Card',
      mode: this.mode
    });
  }

  showMethodActions(method: any) {
    const actionSheet = this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Delete this card',
          role: 'destructive',
          handler: () => {
            this.deletePaymentMethod(method);
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
        },
      ],
    });
    actionSheet.present();
  }

  async deletePaymentMethod(method: any) {
    const loading = this.loader.create();
    await loading.present();
    try {
      // Remove on server
      await this.paymentMethodService.deletePaymentMethod(method);

      // Remove locally
      this.paymentMethodService.removePaymentMethod(method);
      await loading.dismiss();
    } catch (e) {
      const alert = this.alertCtrl.create({
        title: 'Error',
        message: `This payment method could not be removed.`,
      });
      alert.present();
      await loading.dismiss();
      throw e;
    }
  }
}
