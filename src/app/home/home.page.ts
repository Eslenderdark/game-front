import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonSpinner,
  IonButton, IonCol, IonInput, IonRow, IonGrid, IonCard, IonCardHeader, IonItem, IonCardTitle,
  IonCardContent, IonCardSubtitle, IonText, IonLabel, IonList, IonListHeader, IonBadge, IonAvatar
} from '@ionic/angular/standalone';
import io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

import { AuthService } from '@auth0/auth0-angular';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import socket from 'socket.io-client';


import { CrearSalaModalComponent } from 'src/app/crear-sala-modal/crear-sala-modal.component';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonIcon, IonSpinner, IonListHeader, IonBadge, IonAvatar,
    IonButton, IonCol, IonInput, IonRow, IonGrid,
    IonCard, IonCardHeader, IonItem, IonCardTitle,
    IonCardContent, IonCardSubtitle, IonText, IonLabel, IonList,
    CrearSalaModalComponent, IonListHeader, IonBadge
  ],
})
export class HomePage implements OnInit {
  userEmail: string = '';
  nombrePersonaje: string = '';
  clasePersonaje: any = {};
  socket: any;
  join_room = '';
  username = '';
  message = '';
  nombre: string = '';
  messages: { username: string, message: string }[] = [];
  users: string[] = [];
  typingUsers: Set<string> = new Set();
  joined = false;

  public player: any = {};
  public character: any = {};
  public  salas: any[] = [];


  public url_host: string = 'https://back-rpg.onrender.com';
  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.socket = socket(this.url_host)

    this.auth.user$.subscribe((data) => {
      this.player = data;
      console.log('player:', this.player);
      console.log('localStorage nombre:', localStorage.getItem('nombrePersonaje'));
      console.log('localStorage clase:', localStorage.getItem('clasePersonaje'));
      console.log('Email autenticado:', this.player?.email);


      const nombre = localStorage.getItem('nombrePersonaje');
      const clase = localStorage.getItem('clasePersonaje');

      if (nombre && clase) {
        this.nombrePersonaje = nombre;
        this.clasePersonaje = JSON.parse(clase);
      }


      // USUARIO
      this.http.get(`${this.url_host}/player/${this.player.email}`)
        .pipe(
          catchError(err => {
            if (err.status === 404) {
              console.log('Jugador no encontrado, redirigiendo...');
              this.router.navigate(['/createplayer']);
            } else {
              console.error('Error al obtener el jugador:', err);
            }
            return of(null);
          })
        )
        .subscribe((response: any) => {
          if (response) {
            this.character = response;
              
          }
        });


    });

    
 // Escucha cuando el servidor pide las salas
  this.socket.on('pedir_salas', () => {
    this.socket.emit('enviar_salas', this.salas);
  });

  // Otros listeners opcionales
  this.socket.on('sala_creada', (nuevaSala:any) => {
    this.salas.push(nuevaSala);
  });

  this.socket.on('todas_las_salas', (salasServidor:any) => {
    this.salas = salasServidor;
  });
    
    // this.nombre = localStorage.getItem('nombrePersonaje') || 'Nombre no definido';

  }
  async abrirModalCrearSala() {
    const modal = await this.modalCtrl.create({
      component: CrearSalaModalComponent
    });

    modal.onDidDismiss().then(result => {
      if (result.data?.nombre) {
        this.crearSala(result.data.nombre);
      }
    });

    await modal.present();
  }

 crearSala(nombre: string) {
  const nuevaSala = {
    id: Date.now(),
    nombre,
    jugadores: this.character.name
  };

  this.socket.on('createroom', nuevaSala); // <- Enviar al servidor

  return nuevaSala.id;
}

  unirsesala(room_num: number) {
  const payload = {
    code: room_num,
    user_id: this.character.id  // o this.player.email si es único
  };

  this.socket.emit("join_room", payload);

  this.router.navigate(['/room', { room: room_num, player: JSON.stringify(this.character) }]);
}


}