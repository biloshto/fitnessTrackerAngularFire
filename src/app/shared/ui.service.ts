import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
// we have to add @Injectable() here because we want to inject the snackbar in this service
export class UIService {
  loadingStateChanged = new Subject<boolean>();
  // boolean to indicate whether loading started or finished, let's say

  constructor(private snackbar: MatSnackBar) {}
  // we have to inject the snackBar because it's invoked programmatically

  showSnackbar(message, action, duration) {
    this.snackbar.open(message, action, {
      duration: duration
    });
  }
  // adding the SnackBar Material component to display error messages; the open() method of the snackBar takes in a message as the first argument, the next argument would be a potential action, like a button we can click to dismiss the snackBar, and an object we're passing in to configure the duration of the snackBar; this is now a re-usable showSnackbar() method which we can use from inside the AuthService
}
// this class simply has our event emitter


// controls global UI functionalities