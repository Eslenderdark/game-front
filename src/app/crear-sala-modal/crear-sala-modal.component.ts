import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-crear-sala-modal',
  standalone: true,
  templateUrl: './crear-sala-modal.component.html',
  styleUrls: ['./crear-sala-modal.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class CrearSalaModalComponent {
  nombreSala: string = '';

  constructor(private modalCtrl: ModalController) {}

  cerrar() {
    this.modalCtrl.dismiss();
  }

  crear() {
    if (this.nombreSala.trim()) {
      this.modalCtrl.dismiss({
        nombre: this.nombreSala
      });
    }
  }
}
