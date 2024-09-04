import { Component, ElementRef, ViewChild } from '@angular/core';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-image-display',
  standalone: true,
  template: `
    <canvas #imageCanvas></canvas>
    <button (click)="applyGrayscale()">Apply Grayscale</button>
  `
})
export class ImageDisplayComponent {
  @ViewChild('imageCanvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    if (!this.ctx) {
      console.error('Canvas context is not available');
      return;
    }

    this.imageService.getImage().subscribe({
      next: (image) => {
        if (image) {
          this.drawImage(image);
        } else {
          console.error('Image is null');
        }
      },
      error: (error) => {
        console.error('Error loading image:', error);
      }
    });
  }

  drawImage(image: HTMLImageElement) {
    this.canvas.nativeElement.width = image.width;
    this.canvas.nativeElement.height = image.height;
    this.ctx.drawImage(image, 0, 0);
  }

  applyGrayscale() {
    if (!this.ctx) {
      console.error('Canvas context is not available');
      return;
    }

    const imageData = this.ctx.getImageData(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // red
      data[i + 1] = avg; // green
      data[i + 2] = avg; // blue
    }
    this.ctx.putImageData(imageData, 0, 0);
  }
}
