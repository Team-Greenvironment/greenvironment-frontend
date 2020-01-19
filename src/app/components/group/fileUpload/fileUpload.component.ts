import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {SelfService} from '../../../services/selfservice/self.service';
import {environment} from '../../../../environments/environment';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'group-file-upload-dialog',
  templateUrl: 'fileUploadDialog.component.html',
  styleUrls: ['./fileUpload.component.sass'],
})
export class DialogGroupFileUploadComponent {
  public errorOccurred = false;
  public uploading = false;
  private errorMessage: string;
  public profilePictureUrl: BehaviorSubject<string | null>;
  private file;
  public localFileUrl;

  constructor(public dialogRef: MatDialogRef<DialogGroupFileUploadComponent>, private selfService: SelfService) {
    this.profilePictureUrl = new BehaviorSubject<string | null>(null);
  }

  /**
   * Getter for the error message
   */
  getErrorMessage() {
    return this.errorMessage;
  }

  /**
   * Fired when the cancel button of the dialog is pressed
   */
  onCancelClicked() {
    this.dialogRef.close();
  }

  /**
   * Fired when the ok button was pressed
   */
  onOkClicked() {
    if (this.file) {
      this.errorOccurred = false;
      this.uploading = true;
      this.selfService.changeProfilePicture(this.file).subscribe((response) => {
        this.uploading = false;
        if (response.success) {
          this.profilePictureUrl.next(environment.greenvironmentUrl + response.fileName);
          this.dialogRef.close();
        } else {
          this.errorMessage = response.error;
          this.errorOccurred = true;
        }
      }, (error) => {
        this.uploading = false;
        this.errorOccurred = true;
        console.error(error);
        if (error.error) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = 'Failed to upload the profile picture.';
        }
      });
    } else {
      this.errorOccurred = true;
      this.errorMessage = 'Please select a file to upload.';
    }
  }

  /**
   * Fired when the input of the file select changes.
   * @param event
   */
  onFileInputChange(event) {
    this.errorOccurred = false;
    this.errorMessage = '';
    this.file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.localFileUrl = e.target.result;
    };
    reader.readAsDataURL(this.file);
  }
}
