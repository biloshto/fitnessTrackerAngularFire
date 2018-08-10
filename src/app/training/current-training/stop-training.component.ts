import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: 'app-stop-training',
  template: `
    <h1 mat-dialog-title style="text-align: center;">
      Are you sure?
    </h1>
    <mat-dialog-content>
      <p style="text-align: center;">
        You already got {{ passedData.progress }}% of your workout finished.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions fxLayout="row" fxLayoutAlign="center center">
      <button mat-button [mat-dialog-close]="true">
        Yes
      </button>
      <button mat-button [mat-dialog-close]="false">
        No
      </button>
    </mat-dialog-actions>
  `
})
export class StopTrainingComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any) {}
  // with MAT_DIALOG_DATA we're telling Angular Material in your reference of data, where you somehow store the data of the currently opened dialog, give me the data and store it in the passedData property
}