import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // @ViewChild('sidenav');
  // this gives us access to the sidenav local reference so we can use it in our onToggle() function

  // onToggle() {

  // }

  constructor(private authService: AuthService) {}
  // injecting the AuthService so we can call the initAuthListener() method from there upon initialization of this component

  ngOnInit() {
    this.authService.initAuthListener();
  }
}
