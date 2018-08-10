import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit, OnDestroy {
  @Output() closeSidenav = new EventEmitter<void>();
  // with Output we make this listenable event to which we can listen from the outside
  isAuth = false;
  // the user is not logged in initially, so isAuth should be false
  authSubscription: Subscription;
  // property which is undefined initially but where we store the subscription

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
      // this will be true if a user is logged in, or false if it's not
    });
    // in subscribe we're receiving the emitted data, so true or false, whenever we call next in the AuthService
    // IMPORTANT: if we're subscribing to an observable as we're doing it here, we also should unsubscribe if we don't need it anymore; this clears up unneeded memory and prevents memory leaks; to do this we need to import Subscription from rxjs and this allows us to create a new property of type Subscription which is undefined initially but where we store this subscription we're creating here; we should unsubscribe whenever this component gets destroyed, so in the OnDestroy() method
  }

  onClose() {
    this.closeSidenav.emit();
    // we emit an event whenever we click a link in the sidenav menu, so all we have to do now is listen to closeSidenav back in our AppComponent html file in the app-sidenav-list selector
  }
  // out goal is to emit a custom event in our SidenavListComponent to which we can listen from our AppComponent (in our app-sidenav-list selector) which then we can use to call close on the sidenav reference

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

}
