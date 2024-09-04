import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { ImageDisplayComponent } from './image-display/image-display.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ImageDisplayComponent, ImageUploadComponent],
  template: `
    <div class="container">
      <h1>Image Editor</h1>
      <app-image-upload></app-image-upload>
      <app-image-display></app-image-display>
    </div>
  `,
})
export class AppComponent {}
