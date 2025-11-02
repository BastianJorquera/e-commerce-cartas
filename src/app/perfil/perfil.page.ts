import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalHeaderComponent } from '../shared/global-header/global-header.component';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonAvatar,
  IonButton,
  IonIcon,
  IonText,
  IonLabel,
  IonItem,
  IonList,
  IonNote,
  AlertController,
  ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  personOutline,
  heartOutline,
  receiptOutline,
  logOutOutline,
  chevronForwardOutline,
  cameraOutline
} from 'ionicons/icons';

import { UsuarioService } from '../services/usuario.service';
import { PerfilUsuario } from '../models/interfaces/usuario.interface';

@Component({
  selector: 'app-perfil',
  templateUrl: 'perfil.page.html',
  styleUrls: ['perfil.page.scss'],
  standalone: true,
  imports: [
    GlobalHeaderComponent,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonAvatar,
    IonButton,
    IonIcon,
    IonText,
    IonLabel,
    IonItem,
    IonList,
    IonNote
  ],
})
export class PerfilPage implements OnInit, OnDestroy {
  perfil: PerfilUsuario | null = null;
  private subscription?: Subscription;

  menuOpciones = [
    {
      id: 'informacion',
      titulo: 'Información Personal',
      icono: 'person-outline',
      descripcion: 'Editar datos personales y dirección',
      ruta: '/informacion-personal'
    },
    {
      id: 'wishlist',
      titulo: 'Lista de Deseos',
      icono: 'heart-outline',
      descripcion: 'Cartas guardadas para comprar más tarde',
      ruta: '/wishlist'
    },
    {
      id: 'historial',
      titulo: 'Historial de Compras',
      icono: 'receipt-outline',
      descripción: 'Ver todas mis compras anteriores',
      ruta: '/historial-compras'
    }
  ];

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({
      personOutline,
      heartOutline,
      receiptOutline,
      logOutOutline,
      chevronForwardOutline,
      cameraOutline
    });
  }

  ngOnInit() {
    this.subscription = this.usuarioService.obtenerPerfil().subscribe(
      perfil => this.perfil = perfil
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onCambiarFoto(): void {
    // TODO: Implementar cambio de foto real
    this.mostrarToast('Función de cambiar foto próximamente', 'primary');
  }

  onNavegar(ruta: string): void {
    this.router.navigate([ruta]);
  }

  async onCerrarSesion(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          role: 'confirm',
          handler: () => {
            this.usuarioService.cerrarSesion();
            this.mostrarToast('Sesión cerrada correctamente', 'success');
            // TODO: Redirigir a página de login cuando esté implementada
          }
        }
      ]
    });

    await alert.present();
  }

  private async mostrarToast(mensaje: string, color: string): Promise<void> {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'bottom'
    });
    await toast.present();
  }

  get nombreCompleto(): string {
    if (!this.perfil) return '';
    return `${this.perfil.usuario.nombre} ${this.perfil.usuario.apellido}`;
  }

  get totalGastadoFormateado(): string {
    if (!this.perfil) return '';
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(this.perfil.estadisticas.totalGastado);
  }

  get fechaUltimaCompraFormateada(): string {
    if (!this.perfil?.estadisticas.fechaUltimaCompra) return 'Sin compras';
    return this.perfil.estadisticas.fechaUltimaCompra.toLocaleDateString('es-CL');
  }

  get tiempoRegistro(): string {
    if (!this.perfil) return '';
    const ahora = new Date();
    const registro = this.perfil.usuario.fechaRegistro;
    const diff = ahora.getTime() - registro.getTime();
    const dias = Math.floor(diff / (1000 * 3600 * 24));

    if (dias < 30) {
      return `Miembro desde hace ${dias} días`;
    } else if (dias < 365) {
      const meses = Math.floor(dias / 30);
      return `Miembro desde hace ${meses} mes${meses > 1 ? 'es' : ''}`;
    } else {
      const años = Math.floor(dias / 365);
      return `Miembro desde hace ${años} año${años > 1 ? 's' : ''}`;
    }
  }
}
