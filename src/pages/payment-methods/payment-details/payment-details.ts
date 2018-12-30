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

declare const Spreedly: any;

export enum PaymentDetailsPageMode {
  PAY_TAB = 'PAY_TAB',
  SAVE_CARD = 'SAVE_CARD',
}

interface INewCard {
  month: number,
  year: number,
  full_name: string,
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
  newCard: INewCard = { month: 1, year: 1973, full_name: '' };
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
    private paymentService: PaymentService
  ) {
    this.mode = navParams.get('mode');
    this.title = navParams.get('title') || 'Payment Details';
    console.log('PAY MODE', this.mode);
    this.saveButtonText = this.mode === PaymentDetailsPageMode.PAY_TAB ? 'Save and Pay' : 'Save';
  }

  ionViewDidLoad() {
    const showError = () => {
      this.loader.dismiss();
      this.navCtrl.popTo('PaymentMethodsPage').then(() => {
        const alert = this.alertCtrl.create({
          title: 'Network Error',
          message: `Please check your connection and try again.`,
        });
        alert.present();
      });
    };
    this.loader.present({ dismissOnPageChange: false }).then(() => {
      this.spreedlyTimeout = setTimeout(showError, 15000);
      try {
        this.initializeSpreedly();
      } catch (error) {
        showError();
        console.error(error);
      }
    });
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

    Spreedly.on('ready', async () => {
      clearTimeout(this.spreedlyTimeout);

      await this.loader.dismiss();

      this.spreedlyReady = true;
      Spreedly.setParam('allow_blank_name', true);
      Spreedly.setFieldType('number', 'tel');
      Spreedly.setFieldType('cvv', 'tel');
      Spreedly.setStyle(
        'number',
        'width: 67%; border-radius: 3px; border: 1px solid #ccc; padding: .65em .5em; font-size: 91%;'
      );
      Spreedly.setStyle(
        'cvv',
        'width: 30%; border-radius: 3px; border: 1px solid #ccc; padding: .65em .5em; font-size: 91%;'
      );
      console.log('SPREEDLY READY');
      this.changeDetectorRef.detectChanges();
    });

    Spreedly.on('errors', async (errors: Error[]) => {
      await this.loader.dismiss();
      this.paymentMethodError = '';
      errors.forEach(error => {
        console.log(error);
        this.paymentMethodError += error.message + '. ';
      });
      this.changeDetectorRef.detectChanges();
    });

    Spreedly.on('paymentMethod', async (token: string, details: string) => {
      await this.loader.dismiss()
      this.paymentService.createGatewayPurchase(token, 499).then(
        response => {
          console.log('response', response);
        },
        error => {
          console.log('error', error);
        }
      );
      console.log('TOKEN HERE', token, details);
    });

    Spreedly.on('validation', async ({ cardType, validNumber, validCvv }: ISpreedlyValidationResponse) => {
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
    });
  }

  validatePaymentMethod() {
    this.loader.present().then(() => {
      Spreedly.validate();
    });
  }

  tokenizePaymentMethod() {
    this.loader.present().then(() => {
      Spreedly.tokenizeCreditCard(this.newCard);
    });
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
}
