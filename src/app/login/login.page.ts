import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { IonHeader, IonToolbar, IonMenuButton, IonButton, IonAlert, IonButtons, IonTitle, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonImg } from '@ionic/angular/standalone';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonMenuButton, IonButton, IonAlert, IonButtons, IonTitle, IonApp, IonSplitPane, IonMenu, IonContent, IonList, IonListHeader, IonNote, IonMenuToggle, IonItem, IonIcon, IonLabel, IonRouterOutlet, IonRouterLink, IonImg]
})
export class LoginPage implements OnInit {

  public user: any;

  public url_host: string = 'https://back-rpg.onrender.com';


  constructor(public auth: AuthService, private router: Router) { }

  ngOnInit() {
    this.auth.user$.subscribe((data) => {
      this.user = data;
      console.log(this.user);

      if (this.user) {
        let usuario = {
          user: this.user.name,
          email: this.user.email,
          picture: this.user.picture
        };
        localStorage.setItem('user', JSON.stringify(usuario));

        // Aquí consultamos al backend si el email ya está registrado
        fetch(`${this.url_host}/player/${this.user.email}`)
          .then(res => {
            if (res.status === 200) {
              this.router.navigate(['/home']);
            } else if (res.status === 404) {
              this.router.navigate(['/createplayer']);
            } else {
              console.error('Error al consultar player:', res.status);
            }
          })
          .catch(err => console.error('Error en fetch:', err));

      }
    });
  }


  login() {
    this.auth.loginWithRedirect({
      appState: {
        target: '/home'
      }
    });
  }
}
