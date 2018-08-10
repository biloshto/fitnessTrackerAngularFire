// import { Component, OnInit } from '@angular/core';
// import { NgForm } from '@angular/forms';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit {

//   constructor() { }

//   ngOnInit() {
//   }

//   onSubmit(form: NgForm) {
//     console.log(form);
//   }

// }



import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from '../../shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  // isLoading is a property that's initially false but which we now switch whenever we get a new loading state
  private loadingSubscription: Subscription;
  // a property where we store our subscription

  constructor(private authService: AuthService, private uiService: UIService) { }

  ngOnInit() {
    this.loadingSubscription = this.uiService.loadingStateChanged.subscribe(isItLoading => {
      this.isLoading = isItLoading;
    });
    // we're listening for changes in the loading state once we initialized this component, and store the subscription in a property so we could unsubscribe from it in ngOnDestroy()
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email]
      }),
      password: new FormControl('', {validators: [Validators.required]})
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
      // in the LoginComponent on the email input we assigned a name of email, for password we assigned a name of password which is why we're able to access the name and password on these names
    });
    // on submit we need to log in the user; so we'll reach out to our authService and call the login(), this method expects to get data of type AuthData, which is an object with an email and a password property both holding string values
  }

  ngOnDestroy() {
    if(this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
  }
  // if we don't have subscriptions for some reason and unsubscribe() is called before our subscriptions are created we could get an error, so therefore we should add a check where we say if our subscription exist then we would like to unsubscribe

}



// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../auth.service';
// import { UiService } from '../../shared/ui.service';
// import { Subscription } from 'rxjs/Subscription';

// @Component({
//   selector: 'app-login',
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']
// })
// export class LoginComponent implements OnInit, OnDestroy {
//   private loadingSubs: Subscription;
//   public loginForm: FormGroup;
//   public isLoading = false;

//   constructor(private authService: AuthService, private uiService: UiService) {}

//   ngOnInit(): void {
//     this.loadingSubs = this.uiService.loadingStateChanged.subscribe((isLoadingState: boolean) => {
//       this.isLoading = isLoadingState;
//     });
//     this.loginForm = new FormGroup({
//       email: new FormControl('', {validators: [Validators.required, Validators.email]}),
//       password: new FormControl('', {validators: [Validators.required]})
//     })
//   }

//   ngOnDestroy(): void {
//     if (this.loadingSubs) {
//       this.loadingSubs.unsubscribe();
//     }
//   }

//   public onSubmit(): void {
//     this.authService.login({
//       email: this.loginForm.value.email,
//       password: this.loginForm.value.password
//     });
//   }

// }