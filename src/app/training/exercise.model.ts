export interface Exercise {
  id: string;
  // maybe we'll have characters in our id
  name: string;
  duration: number;
  // in seconds; not all exercises take equally long
  calories: number;
  // calories burned if we make it over the whole duration
  date?: Date;
  // if we finished or cancelled the exercise the date when we started it; the question mark makes this optional because not all exercises have that, if we set up an exercise to populate our dropdown it's not going to have a date
  state?: 'completed' | 'cancelled' | null;
  // to the state we can assign a couple of possible values as a type, so we're accepting two strings (completed and cancelled) or null; this is also optional
}

// here we define how exercies should look like