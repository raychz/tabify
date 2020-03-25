// Local development environment
export const environment = {
	version: require('../../package.json').version,
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
	ablyKey: 'FS6uRw.njPk6Q:iKWFshPE_RfuXlLe',
	sentryDsn: 'https://8b1f236b4d1f4053a24eefb1f8aea326@sentry.io/2364364',
};
