import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { TrainingComponent } from "./training.component";

const routes: Routes = [  
  // { path: 'training', component: TrainingComponent, canActivate: [AuthGuard] }
  // to protect the /training route, we need to attach the auth.guard to the route in the routing setup
  { path: '', component: TrainingComponent }
  // if we use canActivate here we check whether we're allowed to enter this TrainingComponent after we lazy loaded the whole module
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
export class TrainingRoutingModule {}