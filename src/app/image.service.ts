import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private imageSubject = new Subject<HTMLImageElement>();

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post('http://localhost:8080/api/image/upload', formData);
  }

  getImage(): Observable<HTMLImageElement> {
    return this.imageSubject.asObservable();
  }

  setImage(imageUrl: string) {
    const image = new Image();
    image.onload = () => this.imageSubject.next(image);
    image.src = imageUrl;
  }
}
