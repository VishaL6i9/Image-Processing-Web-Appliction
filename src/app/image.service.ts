import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imageUrl: string = '';

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('http://localhost:8080/api/image/upload', formData);
  }

  getImage(): Observable<HTMLImageElement | null> {
    if (this.imageUrl) {
      return of(this.loadImage(this.imageUrl));
    } else {
      return of(null);
    }
  }

  setImage(imageUrl: string) {
    this.imageUrl = imageUrl;
  }

  private loadImage(url: string): HTMLImageElement {
    const image = new Image();
    image.src = url;
    return image;
  }
}
