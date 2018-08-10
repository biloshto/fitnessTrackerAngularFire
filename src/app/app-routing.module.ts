import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { WelcomeComponent } from "./welcome/welcome.component";
import { AuthGuard } from "./auth/auth.guard";

// we're creating the routes first
const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'training', loadChildren: './training/training.module#TrainingModule', canLoad: [AuthGuard] }
  // here we're setting up lazy loading for the TrainingComponent, loadChildren is a keyword for lazy loading and here we pass a string because if we would pass a type and add an import we'd already include it in our bundle at this point so this has to be a string so that it can be analyzed at runtime (here we point to file, to the module we plan on importing when we reach that route, and in there we want to access the TrainingModule which we indicate by adding a hash-tag before the name of the class - this is required because our class name could differ from the file name)
  // canLoad work like the canActivate but it runs before the bundle is loaded
];

// then we need to export them so we can use our AppRoutingModule in our AppModule
@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ]
  // for this routing thing to work, we need to provide the AuthGuard (because behind the scenes it's treated as a service, it's injected by Angular, even though we don’t inject it Angular does this for us); normally we would provide it in the AppModule, but here we'll provide it in the AppRoutingModule because it will still be available to the entire app but we only use it here in this section - this is a rare exception, we normally should provide services in the AppModule or directly in the component, but guards are fine to be provided in the RoutingModule
})
export class AppRoutingModule {}