import { Component, OnDestroy } from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import {ButtonModule} from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import {ToastModule} from 'primeng/toast';
import { BadgeModule } from 'primeng/badge';
import { MessageService } from 'primeng/api';
import { HttpClient, HttpEventType} from '@angular/common/http';
import { AccordionModule } from 'primeng/accordion';
import { CheckboxModule } from 'primeng/checkbox';


@Component({
  selector: 'app-root',
  imports: [  ButtonModule,
              FileUploadModule,
              CommonModule,
              FormsModule,
              ProgressBarModule,
              ToastModule,
              BadgeModule,
              AccordionModule,
              CheckboxModule  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [MessageService]
})
export class AppComponent implements OnDestroy {
  constructor(private messageService: MessageService, private http: HttpClient) {}

  DOC_API = 'http://localhost:4444'
  title = 'DocToInsightFrontEnd';
  totalSize = 0;
  selectedFile: File | null = null;
  task_id: string | null = null;
  isProcessing = false;
  processingTime = 0;
  statusMessage = '';
  results: any = null;
  statusTimer: any = null;
  timeCounter: any = null;
  uploadProgress = 0;
  isUploading = false;
  selectedChecklist: any = {};
  totalAnalysisTime: number = 0;

  onTemplatedUpload() {
    this.totalSize = 0;
  }



  onSelectedFiles(event: any) {
    if (event.files && event.files.length > 0) {
      this.selectedFile = event.files[0];
      this.totalSize = this.selectedFile ? this.selectedFile.size : 0;
    }
  }

  analyzeFile() {
    if (!this.selectedFile) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Please select a file first'});
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.isProcessing = true;
    this.isUploading = true;
    this.uploadProgress = 0;
    this.processingTime = 0;
    this.statusMessage = 'Uploading file...';
    this.results = null;

    console.log('Uploading file to:', `${this.DOC_API}/main`);

    this.http.post(`${this.DOC_API}/main`, formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          // Update upload progress
          if (event.total) {
            this.uploadProgress = Math.round(100 * event.loaded / event.total);
            this.statusMessage = `Uploading file... ${this.uploadProgress}%`;
          }
        } else if (event.type === HttpEventType.Response) {
          // Upload completed, process response
          this.isUploading = false;
          this.uploadProgress = 100;
          const response = event.body;

          console.log('API Response:', response);

          // Check different possible response structures
          if (response && (response.status === 200 || response.status === 'success' || response.task_id)) {
            this.task_id = response.task_id;
            this.statusMessage = 'File uploaded, starting analysis...';
            this.startStatusPolling();
          } else if (response && response.error) {
            console.error('API returned error:', response.error);
            this.messageService.add({severity: 'error', summary: 'Error', detail: response.error || 'Failed to start analysis'});
            this.isProcessing = false;
          } else {
            console.log('Unexpected response structure:', response);
            // Try to extract task_id anyway if it exists
            if (response.task_id) {
              this.task_id = response.task_id;
              this.statusMessage = 'File uploaded, starting analysis...';
              this.startStatusPolling();
            } else {
              this.messageService.add({severity: 'error', summary: 'Error', detail: 'Unexpected response from server'});
              this.isProcessing = false;
            }
          }
        }
      },
      error: (error) => {
        console.error('Upload error details:', error);
        console.error('Error status:', error.status);
        console.error('Error message:', error.message);
        console.error('Error response:', error.error);

        let errorMessage = 'Failed to upload file';
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.messageService.add({severity: 'error', summary: 'Upload Error', detail: errorMessage});
        this.isProcessing = false;
        this.isUploading = false;
        this.uploadProgress = 0;
      }
    });
  }

  startStatusPolling() {
    // Start processing time counter
    this.processingTime = 0;
    const startTime = Date.now();

    // Update processing time every second for UI display
    const timeCounter = setInterval(() => {
      this.processingTime = Math.floor((Date.now() - startTime) / 1000);
    }, 1000);

    // Check status every 3 seconds
    this.statusTimer = setInterval(() => {
      this.checkStatus();
    }, 3000);

    // Store the time counter reference to clear it later
    this.timeCounter = timeCounter;

    // Check status immediately on start
    this.checkStatus();
  }

  checkStatus() {
    if (!this.task_id) return;

    this.http.get(`${this.DOC_API}/status/${this.task_id}`).subscribe({
      next: (data: any) => {
        const status = data.status;

        if (status === "processing") {
          this.statusMessage = data.message || 'Processing...';
          // Keep using local processing time for UI display
        } else if (status === "completed") {
          this.statusMessage = data.message || 'Analysis completed';
          this.results = data.result;
          this.isProcessing = false;
          this.clearStatusTimer();

          // Use server's total processing time if available, otherwise use local time
          const totalProcessingTime = data.processing_time || this.processingTime;
          this.totalAnalysisTime = totalProcessingTime;

          // Initialize selectedChecklist for each requirement
          if (this.results && Array.isArray(this.results)) {
            this.results.forEach((item: any) => {
              if (item.requirement && item.testchecklist) {
                this.selectedChecklist[item.requirement] = {};
                item.testchecklist.forEach((checklist: string) => {
                  this.selectedChecklist[item.requirement][checklist] = false;
                });
              }
            });
          }

          console.log('Analysis Results:', this.results);
          console.log('Total Processing Time from server:', data.processing_time);
          console.log('Local Processing Time:', this.processingTime);
          console.log('Initialized selectedChecklist:', this.selectedChecklist);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Analysis completed in ${this.formatTime(totalProcessingTime)}`
          });

        } else if (status === "cancelled") {
          this.statusMessage = data.message || 'Analysis cancelled';
          this.isProcessing = false;
          this.clearStatusTimer();
          this.messageService.add({severity: 'warn', summary: 'Cancelled', detail: data.message});

        } else if (status === "failed") {
          this.statusMessage = data.message || 'Analysis failed';
          this.isProcessing = false;
          this.clearStatusTimer();
          this.messageService.add({severity: 'error', summary: 'Error', detail: data.message});
        }
      },
      error: (error) => {
        console.error('Status check error:', error);
        this.messageService.add({severity: 'error', summary: 'Status Check Failed', detail: 'Stopping analysis and resetting to initial state'});
        this.resetToInitialState();
      }
    });
  }

  cancelAnalysis() {
    if (!this.task_id) return;

    this.http.post(`${this.DOC_API}/stop/${this.task_id}`, {}).subscribe({
      next: (data: any) => {
        if (data.status === "cancelled") {
          this.statusMessage = 'Analysis cancelled';
          this.isProcessing = false;
          this.clearStatusTimer();
          this.messageService.add({severity: 'warn', summary: 'Cancelled', detail: data.message});
        }
      },
      error: (error) => {
        console.error('Cancel error:', error);
        this.messageService.add({severity: 'error', summary: 'Error', detail: 'Failed to cancel analysis'});
      }
    });
  }

  clearStatusTimer() {
    if (this.statusTimer) {
      clearInterval(this.statusTimer);
      this.statusTimer = null;
    }
    if (this.timeCounter) {
      clearInterval(this.timeCounter);
      this.timeCounter = null;
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  }

  resetToInitialState() {
    // Stop all processing
    this.clearStatusTimer();

    // Reset all state variables to initial values
    this.isProcessing = false;
    this.isUploading = false;
    this.uploadProgress = 0;
    this.processingTime = 0;
    this.statusMessage = '';
    this.task_id = null;
    this.results = null;
    this.selectedChecklist = {};
    this.timeCounter = null;
    this.totalAnalysisTime = 0;

    console.log('Frontend reset to initial state');
  }

  ngOnDestroy() {
    this.clearStatusTimer();
  }

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
