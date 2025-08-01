import { Component } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import {ButtonModule} from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import {ToastModule} from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  imports: [ButtonModule, FileUploadModule, CommonModule, ProgressBarModule, ToastModule, BadgeModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService]
})
export class AppComponent {
  title = 'DocToInsightFrontEnd';
  totalSize = 0;
  totalSizePercent = 0;
  index = 0;

  onTemplatedUpload() {
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onSelectedFiles(event: any) {
    this.totalSize = 0;
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
      this.totalSize = this.selectedFile ? this.selectedFile.size : 0;
    }
  }

  analyzeFile() {
    // This will be implemented later for HTTP upload and analysis
    console.log('File ready for analysis:', this.selectedFile);
  }

  selectedFile: File | null = null;

  formatSize(size: number) {
    if (size < 1024) {
      return size + 'B';
    } else if (size < 1048576) {
      return (size / 1024).toFixed(1) + 'KB';
    } else {
      return (size / 1048576).toFixed(1) + 'MB';
    }
  }

  onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: number) {
    removeFileCallback(index);
  }


  choose(event: any, chooseCallback: any) {
    chooseCallback();
  }

}
