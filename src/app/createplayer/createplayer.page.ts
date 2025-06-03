import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-createplayer',
  templateUrl: './createplayer.page.html',
  styleUrls: ['./createplayer.page.scss'],
})
export class CreateplayerPage implements OnInit {

  public playerDATA: any = {};
  public nombrePersonaje: string = '';
  public url_host = 'https://back-rpg.onrender.com';

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.user$.subscribe(data => {
      this.playerDATA = data;
    });
  }

  verificarYGuardar() {
    if (!this.nombrePersonaje.trim()) {
      alert('Por favor escribe un nombre.');
      return;
    }

    const datos = {
      email: this.playerDATA.email,
      name: this.nombrePersonaje.trim()
    };

    this.http.post(`${this.url_host}/players`, datos).subscribe({
      next: (res: any) => {
        // Si todo bien, ir a home
        this.router.navigate(['/home']);
      },
      error: err => {
        alert('Error guardando usuario');
        console.error(err);
      }
    });
  }
}
