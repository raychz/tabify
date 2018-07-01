import { Injectable } from '@angular/core';
import { AlertController, Alert, AlertOptions } from 'ionic-angular';

@Injectable()
export class AlertService {
  constructor(public alertCtrl: AlertController) {}

  create(opts : AlertOptions) {
    return this.alertCtrl.create(opts);
  }
}
