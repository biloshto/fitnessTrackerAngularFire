import { Subject } from 'rxjs';
// Subject is essentially the same as an EventEmmiter we could say, and it's an object that allows us to event emit and subscribe to it in other parts of the app
import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

@Injectable()
// to be able to inject a service into a service, we need to decorate the service where we want to inject the other service with the @Injectable() decorator; we want to inject the Angular router in here so we can	redirect the user whenever they authenticate or log out
export class AuthService {
  authChange = new Subject<boolean>();
  // Subject is of generic type which means it can hold a payload of different type, and we're going to pass a payload that's going to be a boolean, either true or false indicating whether we are logged in or not
  // private user: User;
  // we want to store the currently authenticated user; private field because we want to access this only from inside the service
  // now when we use the AngularFireAuth we no longer store user here, so our isAuth() method always returns false and we can't get to the training route like this
  private isAuthenticated = false;
  // isAuthenticated is of type boolean and should be initially false
  // this authentication approach isn't ideal; we shoudn't store out authentication status in just a boolean, we should work with a token and we should also protect our server, our database, to see if we really got a working authentication
  // to protect our database we should head to the Rules section in Database in our Firebase project(https://console.firebase.google.com/project/fitness-tracker-8958f/database/firestore/rules) and add 'allow read, write: if request.auth != null;' instead of just 'allow read, write;' to only allow authenticated users to read and write from our database
  // we turned protection on Firestore so that unauthenticated users can't access our database and it works just like that, even though we haven't send any token to Firestore; it turns out that AngularFire automatically does that for us if we use AngularFire to manage authentication too; so just because we signed in with email and password meant that AngularFire behind the scenes also stored that token which we received, manages that token, and attaches it to outgoing request so we can work with the database just as we did before but the major difference is that is now protected, that unauthorized access is now not possible

  constructor(
    private router: Router, 
    private afAuth: AngularFireAuth, 
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}
  // the Router allows us to route or navigate around programmatically
  // injecting the trainingService so we can call the cancelSubscriptions() method from there whenever a user logs out

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if(user) {
        // this will only be true if the user is set, so if we're authenticated
        this.isAuthenticated = true;
        // when authenticated successfully set isAuthenticated to true
        this.authChange.next(true);
        // whenever a user has been authenticated (has logged in or signed up) we want to emit an event and we're passing true as a payload because the user is logged in
        this.router.navigate(['/training']);
        // after the user has been authenticated redirect them to the Training page
      } else {
        // if we're unauthenticated
        this.trainingService.cancelSubscriptions();
        // first, we're calling the cancelSubscriptions() method so we unsubscribe and it won't give us back some errors
        this.authChange.next(false);
        // whenever a user logs out we want to emit an event and we're passing false as a payload because the user is no longer logged in
        this.router.navigate(['/login']);
        // after the user logs out redirect them to the Login page
        this.isAuthenticated = false;
        // resetting the user
      }
    });
  }
  // we can listen to any changes in our authentication status using the authState object that is actually an observable to which we can subscribe and it will emit an event whenever the authentication status changes, so when we go from authenticated to unauthenticated, and the other way round; in there we'll receive a user object that is either null if we're unauthenticated, or it is the currently logged in user
  // we just have to make sure that initAuthListener() is called; the best time to call it is, of course, when our app starts so let's go to our AppComponent for this (because this is the very first component that gets instantiated) and implement the OnInit interface there which, of course, forces us to add the ngOnInit() method and in this method we're going to call the AuthService's initAuthListener() method

  registerUser(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    //   // faking an id for now
    // };
    // // this.authChange.next(true);
    // // this.router.navigate(['/training']);
    // // we're calling the authSuccessfully() method instead because it contains the same code as above
    // this.authSuccessfully();
    // we're no longer creating the user like this, instead we reach out to AngularFireAuth
    this.uiService.loadingStateChanged.next(true);
    // setting the loadingStateChanged to true to indicate that we started loading
    this.afAuth.auth.createUserWithEmailAndPassword(
      authData.email, 
      authData.password
    ).then(result => {
      // console.log(result);
      // this.authSuccessfully();
      // we no longer have this method
      this.uiService.loadingStateChanged.next(false);
      // setting the loadingStateChanged to false to indicate that we finished loading
    })
    .catch(error => {
      // console.log(error);
      this.uiService.loadingStateChanged.next(false);
      // setting the loadingStateChanged to false to indicate that we finished loading because even though we did fail but still we were successful in submitting that request
      // this.snackBar.open(error.message, null, {
      //   duration: 3000
      // });
      // commenting out the snackBar.open() method here because instead we write it in the UIService showSnackbar() method for re-usability reasons, leaner code
      this.uiService.showSnackbar(error.message, null, 3000);
      // calling the showSnackbar() method from the UIService to display error messages; this method takes in a message as the first argument (the error object we're getting back from firebase has a message property so we can just access it like this), the next argument would be a potential action (we don't want to set an action, so we're setting this to null), and the third is the duration of the snackBar so we'll pass in 3000, to show this for 3 seconds
    });
    // this returns us a promise where we can listen to the success case with then block, or handle potential errors that might occur, like maybe an email address that's already taken
  }
  // called when the user signs up

  login(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    //   // faking an id for now
    // };
    // // this.authChange.next(true);
    // // this.router.navigate(['/training']);
    // // we're calling the authSuccessfully() method instead because it contains the same code as above
    // this.authSuccessfully();
    this.uiService.loadingStateChanged.next(true);
    // setting the loadingStateChanged to true to indicate that we started loading
    this.afAuth.auth.signInWithEmailAndPassword(
      authData.email, 
      authData.password
    ).then(result => {
      // console.log(result);
      // this.authSuccessfully();
      // we no longer have this method
      this.uiService.loadingStateChanged.next(false);
      // setting the loadingStateChanged to false to indicate that we finished loading
    })
    .catch(error => {
      // console.log(error);
      this.uiService.loadingStateChanged.next(false);
      // setting the loadingStateChanged to false to indicate that we finished loading because even though we did fail but still we were successful in submitting that request
      // this.snackBar.open(error.message, null, {
      //   duration: 3000
      // });
      // commenting out the snackBar.open() method here because instead we write it in the UIService showSnackbar() method for re-usability reasons, leaner code
      this.uiService.showSnackbar(error.message, null, 3000);
    });
    // this again gives us a promise so we can have a success and a fail case
  }
  // called when the user logs in

  // logout() {
  //   this.user = null;
  //   // resetting the user
  //   this.authChange.next(false);
  //   // whenever a user logs out we want to emit an event and we're passing false as a payload because the user is no longer logged in
  //   this.router.navigate(['/login']);
  //   // after the user logs out redirect them to the Login page
  // }
  // // called when the user logs out
  // the above code is now changed to the code below, because we're no longer storing the user

  // logout() {
  //   this.afAuth.auth.signOut();
  //   // this method clears out the authentication
  //   this.trainingService.cancelSubscriptions();
  //   // first, we're calling the cancelSubscriptions() method so we unsubscribe and it won't give us back some errors
  //   this.authChange.next(false);
  //   // whenever a user logs out we want to emit an event and we're passing false as a payload because the user is no longer logged in
  //   this.router.navigate(['/login']);
  //   // after the user logs out redirect them to the Login page
  //   this.isAuthenticated = false;
  //   // resetting the user
  // }
  // // called when the user logs out
  // these above code is no longer needed as it's now handled in the initAuthListener() method in the else block

  logout() {
    this.afAuth.auth.signOut();
    // this method clears out the authentication
  }
  // called when the user logs out

  // getUser() {
  //   // return this.user;
  //   // we can return this.user just like in the above example, and since it's an object and therefore a reference type other parts of the app could now change that object and therefore change the object in the service
  //   return {...this.user};
  //   // to prevent that, we'll return a new object and use the object spread operator to spread the properties of the user object that's stored in the service into this new object; this will break the reference and actually will return a brand new user that has the same properties but it is a different object so if other parts of the app start manipulate this object which we return here they won't manipulate the original user (up there in the class) which is a better practice than directly returning the user
  // }
  // called when we need to get access to the user we stored here because it has a private accessor so it's not available to the outside
  // we no longer need this method when working with AngularFireAuth

  // isAuth() {
  //   return this.user != null;
  //   // if it's not equal to null then the user is authenticated so isAuth will return true; if it's equal to null this will return false
  // }
  // // called to check authentication of a user
  isAuth() {
    return this.isAuthenticated;
    // returns true if isAuthenticated is equal to true
  }
  // called to check authentication of a user

  // private authSuccessfully() {
  //   this.authChange.next(true);
  //   // whenever a user has been authenticated (has logged in or signed up) we want to emit an event and we're passing true as a payload because the user is logged in
  //   this.router.navigate(['/training']);
  //   // after the user has been authenticated redirect them to the Training page
  // }
  // the code in this method is the same for the registerUser() and the login(), so we're writing this method here instead so we don't have duplicate code

  // private authSuccessfully() {
  //   this.isAuthenticated = true;
  //   // when authenticated successfully set isAuthenticated to true
  //   this.authChange.next(true);
  //   // whenever a user has been authenticated (has logged in or signed up) we want to emit an event and we're passing true as a payload because the user is logged in
  //   this.router.navigate(['/training']);
  //   // after the user has been authenticated redirect them to the Training page
  // }
  // the code in this method is the same for the registerUser() and the login(), so we're writing this method here instead so we don't have duplicate code
  // we no longer need the authSuccessfully() method because we're handling successful authentication in the initAuthListener() method in the if block
}



// the goal of this service is to, in the end, allow us to fake a user login and inform other parts of the app about the login so that we can, for example, adjust the header and only show the logout button so the user can logout

// we'll add an event emitter in our AuthService that is used so that we can inform other parts of the app about changes in the authentication flow, in the authentication status - we are not going to use the EventEmitter Angular ships with, because we should only use that EventEmitter to create custom events which we emit in the components, instead we're going to use something different from other package, rxjs, and that's the Subject; we want to emit the event in the HeaderComponent to show or hide the appropriate links for logged in and logged out users