import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
    // this will merge it with the other router behind the scenes
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule {}

// this is loaded eagerly because authentication needs to be available right at the start