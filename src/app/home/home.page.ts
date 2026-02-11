import { Component, signal } from "@angular/core";
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonItem,
} from "@ionic/angular/standalone";
import { FormControl, ReactiveFormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";

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
    IonButton,
    IonInput,
    IonGrid,
    IonRow,
    IonCol,
    IonItem,
  ],
})
export class HomePage {
  searchControl = new FormControl("");
  photos = signal<any>([]);

  // NOTE: This is a publicly available key found in the Pixabay API documentation here: https://pixabay.com/api/docs/#api_search_images
  // App requirements state this needs to be a completely runnable application, so chose to leave this public key in the repo.
  // In a normal scenario, this API key would be a stored secret in a CI/CD pipeline, not in the repo.
  private key = "54604089-e8772ff396a4c1520781746c0";
  private searchUrl = "https://pixabay.com/api/";

  constructor(private http: HttpClient) {}

  onSearch() {
    const searchTerm = this.searchControl.value;

    if (!searchTerm) return;

    const params = {
      key: this.key,
      q: searchTerm,
      // Note: chose to default to 40 for the time being.
      per_page: 40,
    };

    this.http.get<any>(this.searchUrl, { params }).subscribe({
      next: (res) => {
        this.photos.set(res.hits);
      },
      error: (err) => console.error(err),
    });
  }
}
