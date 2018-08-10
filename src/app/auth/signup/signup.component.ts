import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from '../../shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate;
  // maxDate should ensure that a person has to be at least 18 years old
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
    this.maxDate = new Date(); // this is today
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18); // today's year minus 18, so this gives us today 18 years ago
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password
      // in the SignupComponent on the email input we assigned a name of email, for password we assigned a name of password which is why we're able to access the name and password on these names
    });
    // on submit we need to register the user; so we'll reach out to our authService and call the registerUser(), this method expects to get data of type AuthData, which is an object with an email and a password property both holding string values
  }

  ngOnDestroy() {
    if(this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();
    }
    // if we don't have subscriptions for some reason and unsubscribe() is called before our subscriptions are created we could get an error, so therefore we should add a check where we say if our subscription exist then we would like to unsubscribe
  }

}
