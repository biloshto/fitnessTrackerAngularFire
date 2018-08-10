// import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training.service';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  // @Output() trainingExit = new EventEmitter<void>();
  // with Output we make this listenable event to which we can listen from the outside
  // we no longer want to emit an event when we're done or when we cancel a training
  progress = 0;
  timer: number;
  // we're storing the interval in timer so we can stop it after it hits 100

  constructor(public dialog: MatDialog, private trainingService: TrainingService) { }
  // with the TrainingService injected we can now initialize this component with the selected training (we select the training and store it in runningExercise, we even emit an event whenever we choose a new training; now we need to use that information in the CurrentTraining component - we load the CurrentTraining component whenever we start a training); now we can change the step of the timer programmatically for every selected exercise through our TrainingService

  ngOnInit() {
    this.startOrResumeTimer();
    // on init we start the timer
  }

  startOrResumeTimer() {
    const step = this.trainingService.getRunningExercise().duration / 100 * 1000;
    // in step we're calculating the time for the timer; if our training takes 30 seconds, one step should be 30 divided by 100, or actually since this is in milliseconds it should be 30 times 1000 divided by 100
    this.timer = setInterval(() => {
      this.progress = this.progress + 1;
      if(this.progress >= 100) {
        this.trainingService.completeExercise();
        // when progress reaches 100 we're also done, so we're accessing the trainingService and the completeExercise() method where we don't need to pass anything
        clearInterval(this.timer);
        // if we hit 100 we want to clear the interval so it won't go above 100
      }
    }, step)
    // }, 200)
    // takes 20 seconds to complete, we increment it by 1 on every 200 millisecond (20sec or 20000ms/100% = 200)
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
      // we're passing the progress of our current training on the data property to our to-be-opened dialog
    });
    // we want to show a dialog whenever we click on the Stop button; the dialog is a special Material components, it's not added to the html template as we did it all other components we used thus far, instead it's invoked programmaticall

    dialogRef.afterClosed().subscribe(result => {
      // result returns true if the user clicks the Yes button, and false if the user clicks the No button on the dialog
      if(result) {
        // this.trainingExit.emit();
        // we emit an event whenever we click the Yes button, so all we have to do now is listen to trainingExit back in our TrainingComponent html file in the app-current-training selector
        // our goal is to emit a custom event in our CurrentTrainingComponent to which we can listen from our TrainingComponent (in our app-current-training selector) which then we can use to set the ongoingTraining to false
        this.trainingService.cancelExercise(this.progress);
        // we no longer emit trainingExit, instead we're accessing the trainingService and the cancelExercise() method in which we're passing the current progress
      } else {
        this.startOrResumeTimer();
        // if the user clicked on the No button we're resuming the timer
      }
    });
  }
  // this immediately stops the timer

}