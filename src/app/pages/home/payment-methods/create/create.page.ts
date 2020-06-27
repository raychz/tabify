import { Component, OnInit } from '@angular/core';
import { PaymentMethod } from 'src/interfaces/payment-method.interface';
import { NavController, ToastController } from '@ionic/angular';
import { LoaderService } from 'src/services/utilities/loader.service';
import { AlertService } from 'src/services/utilities/alert.service';
import { PaymentMethodService } from 'src/services/payment/payment-method.service';
import { AuthService } from 'src/services/auth/auth.service';
import { AblyTicketService } from 'src/services/ticket/ably-ticket.service';
import { environment } from '@tabify/env';


declare const Spreedly: any;

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage {

  newCard: Partial<PaymentMethod> = { month: 1, year: 2022, full_name: '', zip: '' };
  spreedlyReady = false;
  spreedlyTimeout: any = undefined;
  paymentMethodError = '';
  spreedlyInitializationLoading: any;
  spreedlyValidationLoading: any;
  spreedlyTokenizationLoading: any;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loader: LoaderService,
    public alertCtrl: AlertService,
    // private changeDetectorRef: ChangeDetectorRef,
    private paymentMethodService: PaymentMethodService,
    public auth: AuthService,
    public ablyTicketService: AblyTicketService
  ) {
  }

  async ionViewDidEnter() {
    this.spreedlyInitializationLoading = await this.loader.create();
    await this.spreedlyInitializationLoading.present();
    const showError = async () => {
      await this.spreedlyInitializationLoading.dismiss();
      await this.navCtrl.pop();
      const alert = await this.alertCtrl.create({
        header: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
    };
    this.spreedlyTimeout = setTimeout(showError, 15000);
    try {
      this.newCard.full_name = this.auth.getDisplayName();
      this.initializeSpreedly();
    } catch (e) {
      await showError();
      console.error(e);
      throw e;
    }
  }

  ionViewDidLeave() {
    Spreedly.removeHandlers();
    this.clearSpreedlyTimer();
  }

  initializeSpreedly() {
    Spreedly.init(environment.spreedlyEnvKey, {
      numberEl: 'spreedly-number',
      cvvEl: 'spreedly-cvv',
    });
    Spreedly.on('ready', this.onSpreedlyReady.bind(this));
    Spreedly.on('errors', this.onSpreedlyError.bind(this));
    Spreedly.on('paymentMethod', this.onSpreedlyPaymentMethod.bind(this));
    Spreedly.on('validation', this.onSpreedlyValidation.bind(this));
  }

  async validatePaymentMethod() {
    this.spreedlyValidationLoading = await this.loader.create();
    this.spreedlyValidationLoading.present();
    await Spreedly.validate();
  }

  async tokenizePaymentMethod() {
    this.spreedlyTokenizationLoading = await this.loader.create();
    this.spreedlyTokenizationLoading.present();
    await Spreedly.tokenizeCreditCard(this.newCard);
  }

  async showCvvHelp() {
    const toast = await this.toastCtrl.create({
      message: `For Visa/Mastercard/Discover, the three-digit number is printed on the signature panel on the back of the card. For American Express, the four-digit number is printed on the front of the card.`,
      duration: 6000,
      position: 'top',
    });
    toast.present();
  }

  private clearSpreedlyTimer() {
    if (this.spreedlyTimeout) {
      clearTimeout(this.spreedlyTimeout)
    }
  }

  /*
   ************ Spreedly event handlers ************
   */
  async onSpreedlyReady() {
    clearTimeout(this.spreedlyTimeout);
    this.spreedlyReady = true;
    Spreedly.setParam('allow_blank_name', true);
    Spreedly.setFieldType('number', 'tel');
    Spreedly.setFieldType('cvv', 'tel');
    Spreedly.setStyle(
      'number',
      'width: 67%; border-radius: 3px; border: 1px solid #ccc; padding: .65em .5em; font-size: 91%; color: black; background: white;'
    );
    Spreedly.setStyle(
      'cvv',
      'width: 30%; border-radius: 3px; border: 1px solid #ccc; padding: .65em .5em; font-size: 91%; color: black; background: white;'
    );
    console.log('SPREEDLY READY');
    // this.changeDetectorRef.detectChanges();
    this.spreedlyInitializationLoading.dismiss();
  }

  async onSpreedlyError(errors: any[]) {
    this.paymentMethodError = '';
    errors.forEach(error => {
      console.log(error);
      this.paymentMethodError += error.message + '. ';
    });
    // this.changeDetectorRef.detectChanges();
    await this.spreedlyTokenizationLoading.dismiss();
  }

  async onSpreedlyPaymentMethod(token: string, details: string) {
    try {
      const method = await this.paymentMethodService.createPaymentMethod(details) as any;
      await this.paymentMethodService.initializePaymentMethods();
      await this.navCtrl.pop();

      // switch (this.mode) {
      //   case PaymentDetailsPageMode.NO_PAYMENT_METHOD:
      //     await this.navCtrl.popToRoot();
      //     await this.navCtrl.push(
      //       'LocationPage',
      //       {},
      //       { animate: true, animation: 'md-transition', direction: 'forward' }
      //     );
      //     break;
      //   case PaymentDetailsPageMode.SAVE_ONLY:
      //     await this.navCtrl.pop();
      //     break;
      //   case PaymentDetailsPageMode.SAVE_AND_PAY:
      //     const currentUser = this.ablyTicketService.ticket.usersMap.get(this.auth.getUid());
      //     currentUser.paymentMethod = this.paymentMethodService.paymentMethods.find(m => m.id === method.id);
      //     // Pop twice. Once to get back to Select Payment Method page. Twice to get back to Checkout page.
      //     await this.navCtrl.pop();
      //     await this.navCtrl.pop();
      //     break;
      //   default:
      //     throw new Error('No mode specified in switch.')
      // }
    } catch (e) {
      this.paymentMethodError = 'This payment method could not be saved.';
      throw e;
    }
    await this.spreedlyTokenizationLoading.dismiss();
  }

  async onSpreedlyValidation({ cardType, validNumber, validCvv }) {
    console.log(cardType, validNumber, validCvv);
    if (
      cardType &&
      validNumber &&
      validCvv &&
      this.newCard.month &&
      this.newCard.year
    ) {
      this.paymentMethodError = '';
      this.tokenizePaymentMethod();
    } else {
      this.paymentMethodError =
        'Please enter a valid credit card and CVV number.';
    }
    // this.changeDetectorRef.detectChanges();
    await this.spreedlyValidationLoading.dismiss();
  }

}
