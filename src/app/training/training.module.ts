import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";

import { TrainingComponent } from "./training.component";
import { CurrentTrainingComponent } from "./current-training/current-training.component";
import { NewTrainingComponent } from "./new-training/new-training.component";
import { PastTrainingsComponent } from "./past-trainings/past-trainings.component";
import { StopTrainingComponent } from "./current-training/stop-training.component";
import { TrainingRoutingModule } from "./training-routing.module";

@NgModule({
  declarations: [
    TrainingComponent,
    CurrentTrainingComponent,
    NewTrainingComponent,
    PastTrainingsComponent,    
    StopTrainingComponent
  ],
  imports: [
    SharedModule,
    TrainingRoutingModule
  ],
  // if we use something in the module we need to import it here, these things are not exchanged between modules
  entryComponents: [StopTrainingComponent]
  // since StopTrainingComponent is going to be created automatically, in code at runtime, we have to add it to the entryComponents[] array where we have to add all the components that are neither instantiated by using their selector in the template, or by routing, in other words Angular has no way of finding out whether this component is going to get used and when this is going to be the case so with this, we're telling Angular be prepared to use it!
})
export class TrainingModule {}