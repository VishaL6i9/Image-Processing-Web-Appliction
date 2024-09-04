import { Component } from '@angular/core';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  template: `
    <input type="file" (change)="onFileSelected($event)" accept="image/*">
    <button (click)="onUpload()">Upload</button>
  `
})
export class ImageUploadComponent {
  private file: File | null = null;

  constructor(private imageService: ImageService) {}

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.file = event.target.files[0];
    } else {
      this.file = null;
    }
  }

  onUpload(): void {
    if (this.file) {
      this.imageService.uploadImage(this.file).subscribe({
        next: (response) => {
          console.log('Upload successful', response);
          // @ts-ignore
          const imageUrl = URL.createObjectURL(this.file);
          this.imageService.setImage(imageUrl);
        },
        error: (error) => console.error('Upload failed', error),
        complete: () => console.log('Upload completed')
      });
    }
  }
}
