import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'createplayer',
    loadComponent: () => import('./createplayer/createplayer.page').then( m => m.CreateplayerPage)
  },  {
    path: 'room',
    loadComponent: () => import('./room/room.page').then( m => m.RoomPage)
  },

];
