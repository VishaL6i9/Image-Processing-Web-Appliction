import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient , withInterceptorsFromDi } from '@angular/common/http';

import { AppComponent } from "./app.component";
import { ImageUploadComponent } from "./image-upload/image-upload.component";
import { ImageDisplayComponent } from "./image-display/image-display.component";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ImageUploadComponent,
    ImageDisplayComponent,


  ],
  providers: [provideHttpClient(withInterceptorsFromDi())],
  bootstrap: [AppComponent]
})
export class AppModule { }
