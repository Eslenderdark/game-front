import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardContent, IonItem, IonLabel, IonInput, IonButton 
} from '@ionic/angular/standalone';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createplayer',
  templateUrl: './createplayer.page.html',
  styleUrls: ['./createplayer.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonItem, IonLabel, IonInput, IonButton
  ],
})
export class CreateplayerPage {
  nombrePersonaje: string = '';
  public url_host: string = 'https://back-rpg.onrender.com';

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  crearPersonaje() {
    this.auth.user$.subscribe((userData) => {
      const datosPersonaje = {
        id: userData?.email,
        name: this.nombrePersonaje,
        score: 0,
        gamesPlayed: 0
      };

      this.http.post(`${this.url_host}/crearpersonaje`, datosPersonaje).subscribe({
        next: (response) => {
          localStorage.setItem('nombrePersonaje', this.nombrePersonaje);
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error al crear personaje:', err);
        }
      });
    });
  }
}