import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from 'angularfire2';
// to add Firebase to our app, we should import this AngularFireModule
import { AngularFirestoreModule } from 'angularfire2/firestore';
// we need to import the AngularFirestoreModule because obviously we want to connect to Angular Firestore

import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { AuthService } from './auth/auth.service';
import { TrainingService } from './training/training.service';
import { environment } from '../environments/environment';
import { UIService } from './shared/ui.service';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    // importing MaterialModule here so we have an access to it in our entire app
    AppRoutingModule,
    // so we can use the routes in our app
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    // with this we initialize our AngularFireModule with our firebase data
    AngularFirestoreModule,
    // with this one we now enable the Firestore related functionalities
    AuthModule,
    // TrainingModule
    // removing the TrainingModule from here so we can load it lazily
  ],
  providers: [
    AuthService,
    TrainingService,
    UIService
  ],
  // throughout our app we need to make sure that we use the same instance of the service
  bootstrap: [AppComponent]
})
export class AppModule { }
