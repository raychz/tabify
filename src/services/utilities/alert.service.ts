import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';

@Injectable({ providedIn: 'root' })
export class AlertService {
  constructor(public alertCtrl: AlertController) {}

  create(opts: AlertOptions) {
    return this.alertCtrl.create(opts);
  }
}
