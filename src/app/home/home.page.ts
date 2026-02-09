import { Component, inject, signal } from "@angular/core";
import {
  RefresherCustomEvent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRefresher,
  IonButton,
  IonInput,
  IonRefresherContent,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
  IonList,
} from "@ionic/angular/standalone";
import { MessageComponent } from "../message/message.component";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { DataService, Message } from "../services/data.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
  imports: [
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonRefresher,
    IonRefresherContent,
    IonList,
    IonButton,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
    MessageComponent,
  ],
})
export class HomePage {
  searchControl = new FormControl("");
  private data = inject(DataService);

  photos = signal<any>([]);

  private accessKey = "<enter key>";
  private searchUrl = "https://api.unsplash.com/search/photos";

  constructor(private http: HttpClient) {}

  refresh(ev: any) {
    setTimeout(() => {
      (ev as RefresherCustomEvent).detail.complete();
    }, 3000);
  }

  // TODO: Clean up
  getMessages(): Message[] {
    return this.data.getMessages();
  }

  onSearch() {
    const searchTerm = this.searchControl.value;

    if (!searchTerm) return;

    const headers = new HttpHeaders({
      Authorization: `Client-ID ${this.accessKey}`,
    });

    const params = {
      query: searchTerm,
      per_page: "20",
    };

    this.http.get<any>(this.searchUrl, { headers, params }).subscribe({
      next: (res) => {
        console.log(res.results);
        this.photos.set(res.results);
      },
      error: (err) => console.error("Unsplash Error:", err),
    });
  }
}
