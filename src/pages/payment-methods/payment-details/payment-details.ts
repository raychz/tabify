import { Component, ChangeDetectorRef } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
} from 'ionic-angular';
import { LoaderService } from '../../../services/utilities/loader.service';
import { AlertService } from '../../../services/utilities/alert.service';
import { PaymentService } from '../../../services/payment/payment.service';
import { AuthService } from '../../../services/auth/auth.service';

declare const Spreedly: any;

export enum PaymentDetailsPageMode {
  SAVE_AND_PAY,
  SAVE_ONLY,
}

interface INewCard {
  month: number,
  year: number,
  full_name: string,
  zip: string
}

interface ISpreedlyValidationResponse {
  cardType: string,
  validNumber: boolean,
  validCvv: boolean,
  numberLength: number,
  cvvLength: number
}

@IonicPage()
@Component({
  selector: 'page-payment-details',
  templateUrl: 'payment-details.html',
})
export class PaymentDetailsPage {
  newCard: INewCard = { month: 1, year: 2022, full_name: '', zip: '' };
  spreedlyReady = false;
  mode: PaymentDetailsPageMode;
  title: string;
  saveButtonText: string;
  spreedlyTimeout?: number = undefined;
  paymentMethodError = '';

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public loader: LoaderService,
    public alertCtrl: AlertService,
    private changeDetectorRef: ChangeDetectorRef,
    private paymentService: PaymentService,
    public auth: AuthService
  ) {
    this.mode = navParams.get('mode');
    this.title = navParams.get('title') || 'Payment Details';
    console.log('PAY MODE', this.mode);
    this.saveButtonText = this.mode === PaymentDetailsPageMode.SAVE_AND_PAY ? 'Save and Pay' : 'Save';
  }

  async ionViewDidLoad() {
    const showError = async () => {
      this.loader.dismiss();
      await this.navCtrl.popTo('PaymentMethodsPage');
      const alert = this.alertCtrl.create({
        title: 'Network Error',
        message: `Please check your connection and try again.`,
      });
      alert.present();
    };
    await this.loader.present({ dismissOnPageChange: false });
    this.spreedlyTimeout = setTimeout(showError, 15000);
    try {
      this.newCard.full_name = this.auth.getDisplayName();
      this.initializeSpreedly();
    } catch (error) {
      showError();
      console.error(error);
    }
  }

  ionViewDidLeave() {
    this.loader.dismiss();
    Spreedly.removeHandlers();
    this.clearSpreedlyTimer();
  }

  initializeSpreedly() {
    Spreedly.init('Iu3UapkcfklJXqLJV61vbJsp1dl', {
      numberEl: 'spreedly-number',
      cvvEl: 'spreedly-cvv',
    });
    Spreedly.on('ready', this.onSpreedlyReady.bind(this));
    Spreedly.on('errors', this.onSpreedlyError.bind(this));
    Spreedly.on('paymentMethod', this.onSpreedlyPaymentMethod.bind(this));
    Spreedly.on('validation', this.onSpreedlyValidation.bind(this));
  }

  async validatePaymentMethod() {
    await this.loader.present();
    await Spreedly.validate();
  }

  async tokenizePaymentMethod() {
    await this.loader.present();
    await Spreedly.tokenizeCreditCard(this.newCard);
  }

  showCvvHelp() {
    const toast = this.toastCtrl.create({
      message: `For Visa/Mastercard/Discover, the three-digit number is printed on the signature panel on the back of the card. For American Express, the four-digit number is printed on the front of the card.`,
      duration: 6000,
      position: 'top',
      showCloseButton: true,
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

    await this.loader.dismiss();

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
    this.changeDetectorRef.detectChanges();
  }

  async onSpreedlyError(errors: any[]) {
    await this.loader.dismiss();
    this.paymentMethodError = '';
    errors.forEach(error => {
      console.log(error);
      this.paymentMethodError += error.message + '. ';
    });
    this.changeDetectorRef.detectChanges();
  }

  async onSpreedlyPaymentMethod(token: string, details: string) {
    try {
      const method = await this.paymentService.createPaymentMethod(details);
      this.paymentService.pushPaymentMethod(method);
      await this.navCtrl.popTo('PaymentMethodsPage');
    } catch (e) {
      this.paymentMethodError = 'This payment method could not be saved.';
    } finally {
      await this.loader.dismiss();
    }

    console.log('TOKEN HERE', token, details);
  }

  async onSpreedlyValidation({ cardType, validNumber, validCvv }: ISpreedlyValidationResponse) {
    await this.loader.dismiss();
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
    this.changeDetectorRef.detectChanges();
  }
}
