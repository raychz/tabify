import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { LoadingOptions } from '@ionic/core';
import { SpinnerTypes } from '@ionic/core/dist/types/components/spinner/spinner-configs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  static defaultContent: string = 'Loading...';
  static defaultSpinner: SpinnerTypes = 'dots';

  constructor(public loadingCtrl: LoadingController) {}

  async create(opts: LoadingOptions = {}) {
    const {
      message = LoaderService.defaultContent,
      spinner = LoaderService.defaultSpinner,
      ...rest
    } = opts;
    return await this.loadingCtrl.create({
      message,
      spinner,
      ...rest,
    });
  }
}
