import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonIcon,
  IonCardTitle, IonCardContent, IonListHeader, IonList, IonItem, IonLabel,
  IonAvatar, IonBadge, IonCardSubtitle
} from '@ionic/angular/standalone';
import socket from 'socket.io-client';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonIcon,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, 
    IonListHeader, IonList, IonItem, IonLabel,
    IonAvatar, IonBadge, IonCardSubtitle
  ]
})
export class RoomPage implements OnInit {
  public url_host: string = 'https://back-rpg.onrender.com';
  public socket: any;
  public roomCode: string = '';
  public playersInRoom: any[] = [];

  // Tus datos del personaje
  nombrePersonaje: string = '';
  clasePersonaje: any = {};
  playerEmail: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.socket = socket(this.url_host);

    let params: any = this.route.snapshot.params;
    this.playerEmail = JSON.parse(params.player).email;
    this.roomCode = params.room;

    // Obtener datos del localStorage
    this.nombrePersonaje = localStorage.getItem('nombrePersonaje') || '';
    this.clasePersonaje = JSON.parse(localStorage.getItem('clasePersonaje') || '{}');

    // Preparar info para unirse a la sala
    let info = {
      code: this.roomCode,
      user_name: this.playerEmail,
      personaje: this.nombrePersonaje,
      clase: this.clasePersonaje.name,
      icon: this.clasePersonaje.icon // Asegúrate de tener esto en tu objeto clasePersonaje
    };

    this.socket.emit('join_room', info);

    // Escuchar actualizaciones de la lista de jugadores
    this.socket.on('user_list_' + this.roomCode, (userList: any[]) => {
      console.log('Lista de usuarios actualizada:', userList);
      
      // Mapear los datos para mostrarlos en la interfaz
      this.playersInRoom = userList.map(user => ({
        email: user.user_name,
        nombre: user.personaje,
        clase: user.clase,
        icon: user.icon,
        isYou: user.user_name === this.playerEmail // Marcar si es el usuario actual
      }));
    });
  }
}