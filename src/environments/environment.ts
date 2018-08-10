// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyB0siKxLCBGw1AEZa3KU16x8igZefdGZ2g",
    authDomain: "fitness-tracker-8958f.firebaseapp.com",
    databaseURL: "https://fitness-tracker-8958f.firebaseio.com",
    projectId: "fitness-tracker-8958f",
    storageBucket: "fitness-tracker-8958f.appspot.com",
    messagingSenderId: "926859285770"
  }
  // step 4 from the offical angularfire2 github https://github.com/angular/angularfire2/blob/master/docs/install-and-setup.md
  // getting the info from https://console.firebase.google.com/project/fitness-tracker-8958f/overview, in the Add Firebase to your web app section
  // this is the configuration that will successfully connect us to our Firebase backend
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
