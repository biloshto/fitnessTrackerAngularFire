import { Subject } from 'rxjs';
// Subject is essentially the same as an EventEmmiter we could say, and it's an object that allows us to event emit and subscribe to it in other parts of the app
import { Exercise } from "./exercise.model";
import { Injectable } from '@angular/core';
// we must import Injectable if we want to inject other services in this service
import { AngularFirestore } from 'angularfire2/firestore';
// this is something that we can inject, so a class or rather a service provided by AngularFire2 package which we can inject that gives us methods that will automatically, behind the scenes reach out to Firebase and can do that because we provided our configuration
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';

@Injectable()
export class TrainingService {
  // private availableExercises: Exercise[] = [
  //   { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
  //   { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
  //   { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
  //   { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
  // ];
  // the exercises that are available in our app initially
  // this is no longer relevant because we're no longer directly fetching the exercises, we're using Firebase instead
  private availableExercises: Exercise[] = [];
  // we should initialized and update this array with data coming from the database

  private runningExercise: Exercise;
  // this should store the exercise that the user selected, if any
  exerciseChanged = new Subject<Exercise>();
  // Subject is of generic type which means it can hold a payload of different type, and we're going to pass a payload that's going to be of type Exercise, so that whoever is listening knows which exercise was chosen
  // private finishedExercises: Exercise[] = [];
  // empty array initially, a property where we store all our completed or cancelled exercises
  // we can get rid of the finishedExercises[] array here because we're no longer storing them, instead we're now passing the exercises we get from our database through the finishedExercisesChanged Subject
  exercisesChanged = new Subject<Exercise[]>();
  // we're passing a payload that's going to be of type Exercise[] array (for the available exercises)
  finishedExercisesChanged = new Subject<Exercise[]>();
  // we're passing a payload that's going to be of type Exercise[] array (for the finished exercises)
  private fbSubscriptions: Subscription[] = [];
  // a property where we store our Firebase subscriptions, initially an empty array

  constructor(private database: AngularFirestore, private uiService: UIService) { }

  // getAvailableExercises() {
  //   return this.availableExercises.slice();
  //   // the slice() method will create a real copy of the array for the same reason with the reference type problem for objects; it's the same for arrays and by calling slice() we create a new array which can be edited without effecting the old one
  // }

  fetchAvailableExercises() {
    // this.database.collection('availableExercises').valueChanges().subscribe(result => {
    //   console.log(result);
    // });
    // the above code is the same as the one below, we just put every method call in a new line so it looks cleaner and is easier to read
    this.uiService.loadingStateChanged.next(true);
    // setting the loadingStateChanged to true to indicate that we started loading
    this.fbSubscriptions.push(this.database
      .collection('availableExercises')
      // .valueChanges();
      .snapshotChanges()
      .pipe(map(docArray => {
      // map() gets exactly the same data result would have received and this is our docData, or docArray, and now we want to map this into an array of exercise objects
      // throw(new Error());
      // this throwError line is for testing purposes only; if we uncomment it then we should comment out the return block below to see what will happen in a case of error
        return docArray.map(doc => {
        // this map here in the return is not the rxjs operator; because docArray is an array of objects so map() can be executed on it since this is a normal JavaScript array; here we'll get our individual document, and we want to return a JavaScript object where we have an id, and the other data too (with the spread operator)
          return {
            id: doc.payload.doc.id,
            ...doc.payload.doc.data()
            // this will return an object where each object has the calories, duration, and name properties; with the spread operator we're pulling these properties out of the return object and add them to this object which we return)
            // name: doc.payload.doc.data().name,
            // duration: doc.payload.doc.data().duration,
            // calories: doc.payload.doc.data().calories
            // this is the long version of what we have with the spread operator in case it gives us a warning and we have to change it; this might happen because it's not picking up that the spread operator will successfully pull out all these fields so we're manually assigning them now
          };
        });
      }))
      .subscribe((exercises: Exercise[]) => {
        this.uiService.loadingStateChanged.next(false);
        // setting the loadingStateChanged to false to indicate that we finished loading
        this.availableExercises = exercises;
        // now we want to populate our availableExercises so we're setting them to the exercises we're getting back from Firestore
        this.exercisesChanged.next([...this.availableExercises]);
        // we still need to use these new exercises in our NewTrainingComponent, so to get them there too, we're emitting an event whenever we receive new exercises here, we're emitting an array with all the available exercises (we're using a new array with the spread operator to create a copy so that we don't pass the original array for mutability reasons); now we're emitting this we can subscribe to it in NewTraining
      }, error => {
        // console.log(error);
        this.uiService.loadingStateChanged.next(false);
        // setting the loadingStateChanged to false to indicate that we finished loading because even though we did fail but still we were successful in submitting that request
        this.uiService.showSnackbar('Fetching exercises failed, please try again later!', null, 3000);
        // displaying an error message
        this.exercisesChanged.next(null);
        // emitting an event here with null, so no exercises (when we fail to fetch exercises)
      }));
    // with the code above, we reach out to Angular Firestore, we reach out to a collection there, we listen to events with valueChanges()/snapshotChanges() and subscribe to changes in this collection
    // we're adding this subscription to our fbSubscriptions[] array so we can later unsubscribe from it
    
    // collection() allows us to reach to a specific collection in our Angular Firestore (availableExercises is our collection in the firebase setup - https://console.firebase.google.com/project/fitness-tracker-8958f/database/firestore/data~2FavailableExercises~2F3K29Y8LMcwl88ZaPl21r)
    // valueChanges() will actually give us an observable which is why we can now call subscribe on it; valueChanges() is a really simple event listener that strips out all the meta-data, like the ID, and only gives us the values of our documents
    // snapshotChanges() is a different event listener which also contains some meta-data (is we console log it, we'll get a different object that contains the type that indicates which type of change occured, payload that contains QueryDocumentSnapshot which contains the id of our document, and so on, but it doesn't contain the values of our document, we need to execute an extra method to get the data that's inside of it)
    // so with snapshotChanges() we get the best of both worlds, we can still access the data in our documents, but we also get meta-data like the ids; and if we combine this with an observable operator we can actually map our server-side data in exactly the format we need it to be like in the Exercise model (without date and state, of course)
    // map() is an rxjs operator that can be used on any observable and snapshotChanges() of course gives us an observable, otherwise we couldn't subscribe
  }

  startExercise(selectedId: string) {
    // EXAMPLE FOR WORKING WITH DOCUMENTS INSTEAD OF COLLECTIONS
    // this.database.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
    // the doc() method has one goal - select one single document from the collection, so we're passing the collection first and then the id of the document we want; we then call the update() method on it, so we can add new fields without overriding the old ones - we add data that will be merged with the old data (we can use delete() to get rid of it whenever we select it, or set() to override it); the code above adds the lastSelected key to our document in the Firebase with the date when it was last selected
    this.runningExercise = this.availableExercises.find(exercise => exercise.id === selectedId);
    // we find the exercise that the user selected and temporarily store it in the runningExercise (the arrow function is executed on every element (object) in our array and returns true if the exercise.id, the exercise we're currently looking at, is equal to the selectedId, to the id we get passed as an argument, the id of the exercise the user selected)
    this.exerciseChanged.next({...this.runningExercise});
    // whenever the user selects an exercise we want to emit an event and we're passing a copy of the selected exercise
  }
  // we want to call this method from the NewTrainingComponent when we click on the Start button where we set the exercise that the user choose

  completeExercise() {
    // this.finishedExercises.push({
    //   ...this.runningExercise, 
    //   date: new Date(), 
    //   state: 'completed'
    // });
    // we're no longer pushing to the array, instead we're calling the addDataToDatabase() method and we're passing the same exercise object
    this.addDataToDatabase({
      ...this.runningExercise, 
      date: new Date(), 
      state: 'completed'
    });
    // we're storing the still running exercise in the finishedExercises array; with the spread operator we can copy all the properties of the running exercise, and we also want to override, to set the date when we completed the exercise, and the state to 'completed'
    // after that we're setting the running exercise to null
    this.runningExercise = null;
    this.exerciseChanged.next(null);
    // this basically means we got no running exercise
  }
  // success case, we completed the entire duration

  cancelExercise(progress: number) {
    // this.finishedExercises.push({
    //   ...this.runningExercise, 
    //   duration: this.runningExercise.duration * (progress / 100),
    //   calories: this.runningExercise.calories * (progress / 100),
    //   date: new Date(), 
    //   state: 'cancelled'
    // });
    // we're no longer pushing to the array, instead we're calling the addDataToDatabase() method and we're passing the same exercise object
    this.addDataToDatabase({
      ...this.runningExercise, 
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(), 
      state: 'cancelled'
    });
    // we're storing the still running exercise in the finishedExercises array; with the spread operator we can copy all the properties of the running exercise, and we also want to override, to set the date when we cancelled the exercise, and the state to 'cancelled'; for cancelled exercises we also want to override the duration of the exercise and the calories we burned, for that we need to get the progress we made as an argument in our function
    // after that we're setting the running exercise to null
    this.runningExercise = null;
    this.exerciseChanged.next(null);
    // this basically means we got no running exercise
  }
  // when we cancel the exercise, and we want to store how much we completed and store the calories that we burned

  getRunningExercise() {
    return {...this.runningExercise};
  }
  // runningExercise is a private property, so with this method we're getting that property, or a copy of it with the spread operator (so we can't mutate it from outside of the service)

  // getCompletedOrCancelledExcerices() {
  //   return this.finishedExercises.slice();
  // }
  // because finishedExercises is a private property, getCompletedOrCancelledExcerices() is a helper method that returns all our finished exercises (or a copy of them with the slice() method so we can't mutate them from outside of the service)
  fetchCompletedOrCancelledExcerices() {
    this.fbSubscriptions.push(this.database
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        // this.finishedExercises = exercises;
        // we could even skip this step here because the main thing we want to do is, we want to emit the finishedExercisesChanged event and pass the exercises we get back from our server to whomever is interested; that also means that we can get rid of the finishedExercises[] array up there where we define the properties because we're no longer storing the finished exercises in it
        this.finishedExercisesChanged.next(exercises);
      }, error => {
        console.log(error);
      }));
    // this only gives us an array of the document values without the id of the document, but we don't really need the id here because we only got a read-only access here and we don't need the id for anything
    // now we're only emitting a value whenever we get new finished exercises from the server, and we initiate our listener here when we call fetchCompletedOrCancelledExcerices(); this method is called from the PastTrainingsComponent
    // we're adding this subscription to our fbSubscriptions[] array so we can later unsubscribe from it
  }

  cancelSubscriptions() {
    this.fbSubscriptions.forEach(subscription => subscription.unsubscribe());
    // we're calling the forEach() method on our fbSubscriptions[] array where we can execute some code on every subscription in that array, and for every subscription we simply want to call unsubscribe(); now we just have to call this cancelSubscriptions() method from within the AuthService
  }

  private addDataToDatabase(exercise: Exercise) {
    this.database.collection('finishedExercises').add(exercise);
    // we want to connect to Angular Firestore and save our data to it, so in completeExercise() and cancelExercise() we want to call this method
    // here we reach out to a collection finishedExercises we didn't even create yet; if we connect to a collection that doesn't exist yet it will be created for us automatically on the fly
    // with the code above we're connecting to our collection and calling the add() method on it to store our exercise; this returns us a promise, where we can handle the success case with then block, or catch any errors we might get; but we'll leave it as it is and simply check the database to see if it succeeded
  }
}

// this is where we manage all exercises we know, as well as our completed and cancelled exercises