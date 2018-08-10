import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AngularFireAuthModule } from "angularfire2/auth";

import { SignupComponent } from "./signup/signup.component";
import { LoginComponent } from "./login/login.component";
import { SharedModule } from "../shared/shared.module";
import { AuthRoutingModule } from "./auth-routing.module";

@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AuthRoutingModule
  ]
  // if we use something in the module we need to import it here, these things are not exchanged between modules
})
export class AuthModule {}