import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-past-trainings',
  templateUrl: './past-trainings.component.html',
  styleUrls: ['./past-trainings.component.css']
})
export class PastTrainingsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['date', 'name', 'duration', 'calories', 'state'];
  // this has to be an array of strings and the names in there have to match the names we assigned in our template file with matColumnDef on our ng-container; and we also define the order here
  dataSource = new MatTableDataSource<Exercise>();
  // this is a value that we have to instantiate based on something that we import from Angular Material; MatTableDataSource is simply an object which allows Material Table to connect to, a generic object where we define which kind of data we're passing in (for us it's going to be Exercise - with that we're connecting an Exercise to the MatTableDataSource); MatTableDataSource always expects to get an array of whichever type we're passing, so if we're passing an array of exercises (as we do here), just define Exercise as the type, not an array of exercises like Exercise[] because it'll automatically assume this
  @ViewChild(MatSort) sort: MatSort;
  // to make the table sortable we need to attach some special property of dataSource to our matSort directive we added into the component template; we setup this connection by getting a reference to our matSort directive and for that we can use ViewChild which gives us a way of getting access to elements defined in our templates in our TypeScript file; we're storing this in a sort property (the name is up to us) which is of type MatSort and we need to assign this to dataSource sort and we can't do this in ngOnInit() though, because we're fetching this from the template and the template is not done rendering at this point of time, so we'll use a different life-cycle hook instead and that's the AfterViewInit, and this forces us to add the ngAfterViewInit() method here which executes once the view has done rendering and initializing
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // we need to get access to the paginator (we could also use the local reference we placed on it, but we'll use different approach here) and set up a connection to the dataSource paginator; just like with the sorting, we'll setup the connection in the ngAfterViewInit() method
  private finishedExercisesChangedSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }
  // to populate the dataSource we need the TrainingService because this's where our data lives

  ngOnInit() {
    // this.dataSource.data = this.trainingService.getCompletedOrCancelledExcerices();
    // populating the dataSource; this returns an array of exercises and data expects to get just that, an array
    // until now, we stored the result as data of our data table but this no longer works though because now we have a new method named fetchCompletedOrCancelledExcerices() that gets the finished exercises from our database

    this.finishedExercisesChangedSubscription = this.trainingService.finishedExercisesChanged.subscribe((exercises: Exercise[]) => {
      this.dataSource.data = exercises;
    })
    this.trainingService.fetchCompletedOrCancelledExcerices();
    // the new fetchCompletedOrCancelledExcerices() method doesn't return the values, so we can't directly store them in dataSource.data; instead we now simply emit an event whenever the value has changed, so we should subscribe to the finishedExercisesChanged event and get the exercises from there
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    // the trim() method removes whitespace, and with the toLowerCase() method MatTableDataSource defaults to lowercase matches
    // Angular Material Data Table concatenates all row values to a single string and transforms this string to lowercase; if our row data is: 'Burpees 0.1 3', the filtering string would be 'burpees0.13'; if we then enter 'Bur', it'll match this with this string and search for any occurrences; that's why we should transform our filtering text to lowercase
  }

  ngOnDestroy() {
    if(this.finishedExercisesChangedSubscription) {
      this.finishedExercisesChangedSubscription.unsubscribe();
    }
  }
  // if we don't have subscriptions for some reason and unsubscribe() is called before our subscriptions are created we could get an error, so therefore we should add a check where we say if our subscription exist then we would like to unsubscribe

}
