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
    if (!this.nombrePersonaje || this.nombrePersonaje.trim().length === 0) {
      alert('Por favor, ingresa un nombre válido.');
      return;
    }

    this.auth.user$.subscribe((userData) => {
      if (!userData?.email) {
        alert('No se pudo obtener el email del usuario. Por favor, inicia sesión de nuevo.');
        return;
      }

      const datosPersonaje = {
        id: userData.email,
        name: this.nombrePersonaje.trim(),
        score: 0,
        gamesPlayed: 0
      };

      this.http.post(`${this.url_host}/crearpersonaje`, datosPersonaje).subscribe({
        next: () => {
          // Guardamos el nombre para usarlo en home
          localStorage.setItem('nombrePersonaje', this.nombrePersonaje.trim());

          // Redirigir a home
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Error al crear personaje:', err);
          alert('Error al registrar el jugador, intenta de nuevo.');
        }
      });
    });
  }
}
