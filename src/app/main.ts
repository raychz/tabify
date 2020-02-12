// Hack to allow Sentry to use 'unknown' types
export type mixed = { [key: string]: any } | object | number | string | boolean | symbol | undefined | null | void
declare global {
  type unknown = mixed
}

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
