// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Local development environment
export const environment = {
	version: '0.0.0',
	production: false,
	serverUrl: 'http://localhost:3000',
	firebaseConfig: {
		apiKey: 'AIzaSyCyOe9TB0DTkDtX8B_3ddutEfN0nOy-WdU',
		authDomain: 'tabify-40746.firebaseapp.com',
		databaseURL: 'https://tabify-40746.firebaseio.com',
		projectId: 'tabify-40746',
		storageBucket: 'tabify-40746.appspot.com',
		messagingSenderId: '1044249255712',
	},
	spreedlyEnvKey: 'Iu3UapkcfklJXqLJV61vbJsp1dl',
	ablyKey: 'N0WaAg.cYTfTg:XJnXR07hwbcc6Sxz',
	sentryDsn: 'https://8b1f236b4d1f4053a24eefb1f8aea326@sentry.io/2364364',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
import 'zone.js/dist/zone-error';  // Included with Angular CLI.
